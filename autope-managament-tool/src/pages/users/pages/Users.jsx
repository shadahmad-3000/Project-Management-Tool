import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Space,
  Card,
  message,
  Tag,
  Button,
  Popconfirm,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import { deleteUser, getUsers } from "../../../utils/User";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";

const { Search } = Input;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("No token found, please login.");
          return;
        }

        const res = await getUsers();
        console.log("Fetched Users:", res.data);
        setUsers(res.data?.data || []);
        setFilteredUsers(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        message.error(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(value) ||
        user.empId?.toLowerCase().includes(value) ||
        user.name?.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (empID) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found, please login.");
        return;
      }

      const res = await deleteUser(empID, token);
      message.success(res.data?.message || "User deleted successfully!");
      setUsers((prev) => prev.filter((user) => user.empID !== empID));
      setFilteredUsers((prev) => prev.filter((user) => user.empID !== empID));
    } catch (err) {
      console.error("Delete user failed:", err.response || err);
      message.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Employee ID",
      dataIndex: "empID",
      key: "empID",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      width: 150,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNo",
      key: "phoneNo",
      width: 150,
    },
    {
      title: "OTP Verification Status",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (value) =>
        value ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="red">Not Verified</Tag>
        ),
      width: 150,
    },
    {
      title: "Super-Admin Approval Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (value) =>
        value ? (
          <Tag color="blue">Approved</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
    },
  ];

  if (userRole === "Super-Admin" || userRole === "Admin") {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record.role === "Super-Admin";

        return (
          <Space>
            <Tooltip title="Edit User">
              <Button
                type="text"
                icon={<EditOutlined style={{ color: "blue" }} />}
                onClick={() => navigate(`/home/users/edit/${record.empID}`)}
              />
            </Tooltip>
            <Tooltip
              title={isSuperAdmin ? "Cannot delete Super-Admin" : "Delete User"}
            >
              <span>
                <Popconfirm
                  title="Are you sure you want to delete this user?"
                  onConfirm={() => handleDelete(record.empID)}
                  okText="Yes"
                  cancelText="No"
                  disabled={isSuperAdmin}
                >
                  <Button
                    type="text"
                    icon={
                      <DeleteOutlined
                        style={{ color: isSuperAdmin ? "gray" : "red" }}
                      />
                    }
                    disabled={isSuperAdmin}
                  />
                </Popconfirm>
              </span>
            </Tooltip>
          </Space>
        );
      },
      width: 150,
    });
  }

  return (
    <Card
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Users</h2>
        <Space>
          <Search
            placeholder="Search Users..."
            value={searchValue}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/home/users/add")}
            >
              New User
            </Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default UsersPage;
