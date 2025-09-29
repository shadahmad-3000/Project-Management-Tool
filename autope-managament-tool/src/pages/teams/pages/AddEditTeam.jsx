import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message as antdMessage,
  Spin,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUsers } from "../../../utils/User";
import { createTeam, updateTeam, getTeamById } from "../../../utils/team";
import CButton from "../../../components/common/CButton";

const { Option } = Select;

const AddEditTeam = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigate = useNavigate();
  const { teamCode } = useParams();
  const location = useLocation();

  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getUsers(token);
        setUsers(res.data?.data || []);
      } catch (err) {
        antdMessage.error(
          err.response?.data?.message || "Failed to fetch users"
        );
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditMode && teamCode) {
      setInitialLoading(true);
      const fetchTeam = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await getTeamById(teamCode, token);
          const team = res.data?.data;

          form.setFieldsValue({
            ...team,
            teamMembers: team.teamMembers?.map((m) =>
              typeof m === "object" ? m._id : m
            ),
          });
        } catch (err) {
          antdMessage.error("Failed to load team details");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTeam();
    }
  }, [isEditMode, teamCode, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        const { teamCode, ...rest } = values;
        await updateTeam({ teamCode, updateData: rest }, token);
        antdMessage.success("Team updated successfully!");
      } else {
        await createTeam(values, token);
        antdMessage.success("Team created successfully!");
      }

      navigate("/home/teams");
    } catch (err) {
      antdMessage.error(err.response?.data?.message || "Failed to save team.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Spin size="large" />;

  return (
    <Card
      style={{
        backgroundColor: "#1f1f1f",
        color: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <CButton onClick={() => navigate(-1)} variant="text">
        <ArrowLeftOutlined style={{ marginRight: 6 }} />
        Back
      </CButton>

      <h2>{isEditMode ? "Edit Team" : "Create Team"}</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Team Name"
          name="name"
          rules={[{ required: true, message: "Team Name is required" }]}
        >
          <Input placeholder="Enter team name" />
        </Form.Item>

        <Form.Item
          label="Team Code"
          name="teamCode"
          rules={[{ required: true, message: "Team Code is required" }]}
        >
          <Input placeholder="Unique team code" disabled={isEditMode} />
        </Form.Item>

        <Form.Item
          label="Team Members"
          name="teamMembers"
          rules={[{ required: true, message: "Select at least one member" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select team members"
            optionLabelProp="label"
          >
            {users.map((user) => (
              <Option
                key={user._id}
                value={user._id}
                label={`${user.name} (${user.email})`}
              >
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <CButton type="submit" loading={loading} style={{ width: "100%" }}>
          {isEditMode ? "Update Team" : "Create Team"}
        </CButton>
      </Form>
    </Card>
  );
};

export default AddEditTeam;
