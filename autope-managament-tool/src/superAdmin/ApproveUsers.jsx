import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Card,
  Empty,
  Select,
} from "antd";
import {
  getPendingUsers,
  declineUserById,
  approveUserById,
  assignRoleToUser,
} from "../utils/superAdmin";
import CButton from "../components/common/CButton";

const { Option } = Select;

const ApproveUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roleSelections, setRoleSelections] = useState({});

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await getPendingUsers();
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(list);
    } catch (err) {
      console.error("Failed to fetch pending users", err);
      message.error("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setLoading(true);
    try {
      const res = await approveUserById(userId);
      message.success(res.data?.message || "User approved");
      setUsers((prev) => prev.filter((u) => String(u._id) !== String(userId)));
    } catch (err) {
      console.error("Approve error", err);
      message.error(err.response?.data?.message || "Failed to approve user");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (userId) => {
    setLoading(true);
    try {
      const res = await declineUserById(userId);
      message.success(res.data?.message || "User declined and removed");
      setUsers((prev) => prev.filter((u) => String(u._id) !== String(userId)));
    } catch (err) {
      console.error("Decline error", err);
      message.error(err.response?.data?.message || "Failed to decline user");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, value) => {
    setRoleSelections((prev) => ({ ...prev, [userId]: value }));
  };

  const handleAssignRole = async (email, userId) => {
    const role = roleSelections[userId];
    if (!role) {
      message.warning("Please select a role first");
      return;
    }
    setLoading(true);
    try {
      const res = await assignRoleToUser(email, role);
      message.success(res.data?.message || `Role assigned: ${role}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: role, isApproved: true } : u
        )
      );
      isApproved;
    } catch (err) {
      console.error("Assign role error", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", render: (t) => t || "-" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (t) => t || "-",
    },
    {
      title: "Employee ID",
      dataIndex: "empID",
      key: "empID",
      render: (t) => t || "-",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (t) => t || "-",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (record.isApproved ? "Approved" : "Pending"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const id = record._id || record.id;
        return (
          <Space>
            <Popconfirm
              title={`Approve ${record.name || record.email}?`}
              onConfirm={() => handleApprove(id)}
              okText="Yes"
              cancelText="Cancel"
            >
              <CButton>Approve</CButton>
            </Popconfirm>

            <Popconfirm
              title={`Decline and remove ${record.name || record.email}?`}
              onConfirm={() => handleDecline(id)}
              okText="Yes, Decline"
              cancelText="Cancel"
            >
              <CButton variant="danger">Decline</CButton>
            </Popconfirm>

            <Select
              placeholder="Select Role"
              style={{ width: 140 }}
              onChange={(value) => handleRoleChange(id, value)}
              value={roleSelections[id] || "User"}
            >
              <Option value="User">User</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Team-Lead">Team Lead</Option>
              <Option value="HR">HR</Option>
            </Select>

            <CButton
              onClick={() => handleAssignRole(record.email, id)}
              disabled={!roleSelections[id] && roleSelections[id] !== "User"}
              variant="primary"
            >
              Assign
            </CButton>
          </Space>
        );
      },
    },
  ];

  if (userRole && userRole !== "Super-Admin") {
    return (
      <Card>
        <p>You do not have permission to access this page.</p>
      </Card>
    );
  }

  return (
    <Card
      title="User Approvals"
      style={{ backgroundColor: "#1f1f1f", color: "#f5f5f5" }}
    >
      {users.length === 0 ? (
        <Empty
          description={
            <span style={{ color: "#aaa" }}>No users to approve.</span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ color: "#f5f5f5" }}
        />
      ) : (
        <Table
          rowKey={(record) => record._id || record.id}
          loading={loading}
          dataSource={users}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      )}
    </Card>
  );
};

export default ApproveUsers;
