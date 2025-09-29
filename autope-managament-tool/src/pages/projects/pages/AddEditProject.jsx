import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  message,
  Spin,
} from "antd";
import {
  createProject,
  updateProject,
  getProjectById,
} from "../../../utils/superAdmin";
import dayjs from "dayjs";
import { getTeams } from "../../../utils/team";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";

const { Option } = Select;

const AddEditProject = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const { projectCode } = useParams();
  const location = useLocation();

  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("No token found, please login.");
          return;
        }

        const res = await getTeams(token);
        console.log("Fetched Teams:", res.data);

        setTeams(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        message.error(err.response?.data?.message || "Failed to fetch teams.");
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (isEditMode && projectCode) {
      setInitialLoading(true);
      const fetchProject = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await getProjectById(projectCode, token);
          const project = res.data?.data;

          form.setFieldsValue({
            ...project,
            startDate: project.startDate ? dayjs(project.startDate) : null,
            endDate: project.endDate ? dayjs(project.endDate) : null,
          });
        } catch (err) {
          message.error("Failed to load project details");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProject();
    }
  }, [isEditMode, projectCode, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        const updateData = {
          ...(values.title && { title: values.title }),
          ...(values.description && { description: values.description }),
          ...(values.startDate && {
            startDate: values.startDate.toISOString(),
          }),
          ...(values.endDate && { endDate: values.endDate.toISOString() }),
          ...(values.status && { status: values.status }),
          ...(values.priority && { priority: values.priority }),
        };

        const payload = { projectCode, update: updateData };
        await updateProject(payload, token);
        message.success("Project updated successfully!");
      } else {
        const payload = {
          title: values.title,
          description: values.description || "",
          projectCode: values.projectCode,
          startDate: values.startDate
            ? dayjs(values.startDate).format("YYYY-MM-DD")
            : null,
          endDate: values.endDate
            ? dayjs(values.endDate).format("YYYY-MM-DD")
            : null,
          status: values.status || "Not Started",
          priority: values.priority || "Medium",
          createdBy: localStorage.getItem("userId"),
        };
        await createProject(payload, token);
        message.success("Project created successfully!");
      }

      navigate("/home/projects");
    } catch (err) {
      console.error("Project save failed:", err.response || err);
      message.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Spin size="large" />;

  return (
    <Card
      style={{
        backgroundColor: "#141414",
        color: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <CButton onClick={() => navigate(-1)} variant="text">
        <ArrowLeftOutlined style={{ marginRight: 6 }} />
        Back
      </CButton>

      <h2>{isEditMode ? "Edit Project" : "Create Project"}</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter project title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Enter project description" />
        </Form.Item>

        <Form.Item
          label="Project Code"
          name="projectCode"
          rules={[{ required: true, message: "Code is required" }]}
        >
          <Input placeholder="Unique project code" />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Start date is required" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "End date is required" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select placeholder="Select status">
            <Option value="Not Started">Not Started</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="On Hold">On Hold</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Priority" name="priority">
          <Select placeholder="Select priority">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Assign To Team"
          name="assignedTo"
          rules={[
            { required: true, message: "Please assign to at least one team" },
          ]}
        >
          <Select mode="multiple" placeholder="Select one or more teams">
            {teams.length > 0 ? (
              teams.map((team) => (
                <Option key={team._id} value={team._id}>
                  {team.name} ({team.teamCode})
                </Option>
              ))
            ) : (
              <Option disabled>No teams available</Option>
            )}
          </Select>
        </Form.Item>

        <CButton type="submit" loading={loading} style={{ width: "100%" }}>
          {isEditMode ? "Update Project" : "Create Project"}
        </CButton>
      </Form>
    </Card>
  );
};

export default AddEditProject;
