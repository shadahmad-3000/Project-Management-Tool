import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message as antdMessage,
} from "antd";
import { getUsers } from "../../../utils/User";
import { updateTeam } from "../../../utils/team";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpdateTeam = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          antdMessage.error("No token found. Please log in again.");
          return;
        }

        const res = await getUsers(token);
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        antdMessage.error(
          err.response?.data?.message || "Failed to load users"
        );
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        teamCode: values.teamCode,
        updateData: {
          ...(values.name && { name: values.name }),
          ...(values.teamMembers && { teamMembers: values.teamMembers }),
        },
      };

      const token = localStorage.getItem("token");
      if (!token) {
        antdMessage.error("No token found. Please log in again.");
        return;
      }

      const res = await updateTeam(payload, token);

      antdMessage.success(res.data?.message || "Team updated successfully!");
      form.resetFields();
      navigate("/home/teams");
    } catch (err) {
      console.error("Team update error:", err);
      antdMessage.error(err.response?.data?.message || "Failed to update team");
    }
  };

  return (
    <Card
      className="shadow-xl p-6"
      style={{
        backgroundColor: "#1f1f1f",
        color: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-300 hover:text-white"
      >
        Back
      </Button>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
        Update Team
      </h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Team Code"
          name="teamCode"
          rules={[{ required: true, message: "Team Code is required" }]}
        >
          <Input placeholder="Enter the unique team code" />
        </Form.Item>

        <Form.Item label="Team Name" name="name">
          <Input placeholder="Enter new team name (optional)" />
        </Form.Item>

        <Form.Item label="Team Members" name="teamMembers">
          <Select
            mode="multiple"
            placeholder="Select new members (optional)"
            style={{ width: "100%" }}
          >
            {users.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Update Team
        </Button>
      </Form>
    </Card>
  );
};

export default UpdateTeam;
