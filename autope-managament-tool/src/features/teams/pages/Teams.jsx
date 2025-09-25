import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, message, Tooltip } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getTeams } from "../../../utils/team";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("No token found, please login.");
          return;
        }

        const res = await getTeams(token);
        console.log("Fetched Teams:", res.data);

        setTeams(res.data?.data || []);
        setFilteredTeams(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        message.error(err.response?.data?.message || "Failed to fetch teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = teams.filter(
      (team) =>
        team.name?.toLowerCase().includes(value) ||
        team.teamCode?.toLowerCase().includes(value)
    );
    setFilteredTeams(filtered);
  };

  const columns = [
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Team Code",
      dataIndex: "teamCode",
      key: "teamCode",
    },
    {
      title: "Members",
      dataIndex: "teamMembers",
      key: "teamMembers",
      render: (members) => members?.length || 0,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (userRole === "Super-Admin" || userRole === "Admin") {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Team">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "blue" }} />}
              onClick={() => navigate(`/home/teams/edit/${record.teamCode}`)}
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
        borderRadius: "10px",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Teams</h2>
        <Space>
          <Search
            placeholder="Search teams..."
            value={searchValue}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/home/teams/add")}
            >
              New Team
            </Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTeams}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default TeamsPage;
