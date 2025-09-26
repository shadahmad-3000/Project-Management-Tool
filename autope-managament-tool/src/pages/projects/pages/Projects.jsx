import React, { useEffect, useState } from "react";
import { Card, Table, Input, Button, Space, message, Tooltip } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getProject } from "../../../utils/superAdmin";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("No token found, please login.");
          return;
        }

        const res = await getProject(token);
        console.log("Fetched Projects:", res.data);
        const data = res.data?.data || [];

        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        message.error(
          err.response?.data?.message || "Failed to fetch projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = projects.filter(
      (project) =>
        project.title?.toLowerCase().includes(value) ||
        project.projectCode?.toLowerCase().includes(value)
    );
    setFilteredProjects(filtered);
  };

  const columns = [
    {
      title: "Project Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Project Code",
      dataIndex: "projectCode",
      key: "projectCode",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (userRole === "Super-Admin" || userRole === "Admin") {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Project">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "blue" }} />}
              onClick={() =>
                navigate(`/home/projects/edit/${record.projectCode}`)
              }
            />
          </Tooltip>
        </Space>
      ),
    });
  }

  return (
    <Card
      style={{
        backgroundColor: "#f5f5f5",
        color: "#f5f5f5",
        borderRadius: "10px",
        minHeight: "90vh",
      }}
    >
      <div>
        <h2>Projects</h2>

        <Space>
          <Search
            placeholder="Search for project by name or code"
            value={searchValue}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/home/projects/add")}
            >
              New Project
            </Button>
          )}
        </Space>
      </div>

      <Table
        rowKey="_id"
        dataSource={filteredProjects}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </Card>
  );
};

export default ProjectsPage;
