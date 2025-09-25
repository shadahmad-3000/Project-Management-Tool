import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, message, Tooltip } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getTask } from "../../../utils/superAdmin";
import dayjs from "dayjs";

const { Search } = Input;

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("No token found, please login.");
          return;
        }
        const res = await getTask(token);
        console.log("Fetched Tasks:", res.data);

        setTasks(res.data?.data || []);
        setFilteredTasks(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        message.error(err.response?.data?.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filtered = tasks.filter(
      (task) =>
        task.taskName?.toLowerCase().includes(value) ||
        task.taskId?.toLowerCase().includes(value) ||
        task.description?.toLowerCase().includes(value)
    );
    setFilteredTasks(filtered);
  };

  const columns = [
    { title: "Task Name", dataIndex: "taskName", key: "taskName" },
    { title: "Task ID", dataIndex: "taskId", key: "taskId" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Assignee Emails",
      dataIndex: "assigneeEmail",
      key: "assigneeEmail",
      render: (emails) => (emails && emails.length ? emails.join(", ") : "-"),
    },
    {
      title: "Deadline",
      key: "taskDeadline",
      render: (_, record) => {
        const start = record.taskDeadline?.startDate
          ? dayjs(record.taskDeadline.startDate).format("YYYY-MM-DD HH:mm")
          : "-";
        const end = record.taskDeadline?.endDate
          ? dayjs(record.taskDeadline.endDate).format("YYYY-MM-DD HH:mm")
          : "-";
        return (
          <span>
            {start} → {end}
          </span>
        );
      },
    },
    { title: "Status", dataIndex: "taskStatus", key: "taskStatus" },
    { title: "Priority", dataIndex: "taskPriority", key: "taskPriority" },
    { title: "Duration (hrs)", dataIndex: "taskduration", key: "taskduration" },
  ];

  if (userRole === "Super-Admin" || userRole === "Admin") {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Task">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "blue" }} />}
              onClick={() => navigate(`/home/tasks/edit/${record.taskId}`)}
            />
          </Tooltip>
        </Space>
      ),
    });
  }

  return (
    <Card
      className="shadow-xl"
      style={{
        backgroundColor: "#fff",
        color: "#1f2937",
        borderRadius: "10px",
        overflow: "visible",
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 className="text-xl font-bold">Tasks</h2>
        <Space>
          <Search
            placeholder="Search tasks"
            value={searchValue}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/home/tasks/add")}
            >
              New Task
            </Button>
          )}
        </Space>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredTasks}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default TasksPage;
