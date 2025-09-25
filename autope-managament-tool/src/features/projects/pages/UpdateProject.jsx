import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Card, message } from "antd";
import { updateProject } from "../../../utils/superAdmin";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpdateProject = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const update = {};
      if (values.title) update.title = values.title;
      if (values.description) update.description = values.description;
      if (values.startDate)
        update.startDate = dayjs(values.startDate).toISOString();
      if (values.endDate) update.endDate = dayjs(values.endDate).toISOString();
      if (values.status) update.status = values.status;
      if (values.priority) update.priority = values.priority;

      const payload = {
        projectCode: values.projectCode,
        update,
      };

      console.log("Update payload:", payload);

      const res = await updateProject(payload);
      message.success(res.data?.message || "Project updated successfully!");
      form.resetFields();
      navigate("/home/projects");
    } catch (err) {
      console.error("Update project failed:", err.response || err);
      message.error(err.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="shadow-xl"
      style={{
        backgroundColor: "#141414",
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
        Update Project
      </h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Project Code"
          name="projectCode"
          rules={[{ required: true, message: "Project Code is required" }]}
        >
          <Input placeholder="Enter project code to update" />
        </Form.Item>

        <Form.Item label="Title" name="title">
          <Input placeholder="Enter new title (optional)" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Enter new description (optional)"
          />
        </Form.Item>

        <Form.Item label="Start Date" name="startDate">
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="End Date" name="endDate">
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select placeholder="Select new status">
            <Option value="Not Started">Not Started</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="On Hold">On Hold</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Priority" name="priority">
          <Select placeholder="Select new priority">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
            <Option value="Critical">Critical</Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full"
        >
          Update Project
        </Button>
      </Form>
    </Card>
  );
};

export default UpdateProject;
