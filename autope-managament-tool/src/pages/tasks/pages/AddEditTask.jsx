import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Card,
  DatePicker,
  message as antdMessage,
  Spin,
} from "antd";
import { createTask, getTaskById, updateTask } from "../../../utils/superAdmin";
import { getTeams } from "../../../utils/team";
import dayjs from "dayjs";
import { getUsers } from "../../../utils/User";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";

const { Option } = Select;
const { RangePicker } = DatePicker;

const AddEditTask = () => {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { taskId } = useParams();
  const location = useLocation();

  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        console.log("Fetched Users:", res.data);
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        message.error(err.response?.data?.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          antdMessage.error("No token found, please login.");
          return;
        }

        const res = await getTeams(token);
        console.log("Fetched Teams:", res.data);

        setTeams(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        antdMessage.error(
          err.response?.data?.message || "Failed to fetch teams."
        );
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (isEditMode && taskId) {
      setInitialLoading(true);
      const fetchTask = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await getTaskById(taskId, token);
          const task = res.data?.data;

          form.setFieldsValue({
            ...task,
            taskDeadline: task.taskDeadline
              ? [
                  dayjs(task.taskDeadline.startDate),
                  dayjs(task.taskDeadline.endDate),
                ]
              : [],
          });
        } catch (err) {
          antdMessage.error("Failed to load task details");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTask();
    }
  }, [isEditMode, taskId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...values,
        assignedBy: localStorage.getItem("userId"),
        assignedTo: values.assignedTo || [],
        assigneeEmail: values.assigneeEmail || [],
        taskDeadline: {
          startDate: values.taskDeadline
            ? dayjs(values.taskDeadline[0]).format("YYYY-MM-DD HH:mm")
            : null,
          endDate: values.taskDeadline
            ? dayjs(values.taskDeadline[1]).format("YYYY-MM-DD HH:mm")
            : null,
        },
      };

      if (isEditMode) {
        const { taskId, ...rest } = payload;
        await updateTask({ taskId, updateTask: rest }, token);
        antdMessage.success("Task updated successfully!");
      } else {
        await createTask(payload, token);
        antdMessage.success("Task created successfully!");
      }

      navigate("/home/tasks");
    } catch (err) {
      antdMessage.error(err.response?.data?.message || "Failed to save task.");
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

      <h2>{isEditMode ? "Edit Task" : "Create Task"}</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Task Name"
          name="taskName"
          rules={[{ required: true, message: "Task name is required" }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>

        <Form.Item
          label="Task ID"
          name="taskId"
          rules={[{ required: true, message: "Task ID is required" }]}
        >
          <Input placeholder="Unique task ID" disabled={isEditMode} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter task description" />
        </Form.Item>

        <Form.Item
          label="Assign To Team"
          name="assignedTo"
          rules={[{ required: true, message: "Please assign a team" }]}
        >
          <Select placeholder="Select a team" mode="multiple">
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

        <Form.Item
          label="Assignee Emails"
          name="assigneeEmail"
          rules={[
            { required: true, message: "At least one assignee is required" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select assignees"
            optionLabelProp="label"
          >
            {users.map((user) => (
              <Option
                key={user.email}
                value={user.email}
                label={`${user.name} (${user.email})`}
              >
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Task Deadline"
          name="taskDeadline"
          rules={[{ required: true, message: "Deadline is required" }]}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          label="Task Status"
          name="taskStatus"
          rules={[{ required: true, message: "Please select task status" }]}
        >
          <Select placeholder="Select status">
            <Option value="Not Started">Not Started</Option>
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="On Hold">On Hold</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Duration (in hours)"
          name="taskduration"
          rules={[{ required: true, message: "Task duration is required" }]}
        >
          <Input type="number" placeholder="Enter duration" />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="taskPriority"
          rules={[{ required: true, message: "Please select task priority" }]}
        >
          <Select placeholder="Select priority">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        <CButton type="submit" loading={loading} style={{ width: "100%" }}>
          {isEditMode ? "Update Task" : "Create Task"}
        </CButton>
      </Form>
    </Card>
  );
};

export default AddEditTask;
