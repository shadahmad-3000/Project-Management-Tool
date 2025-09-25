import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { updateUser } from "../../../utils/User";

const UpdateUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updateData = {};
      if (values.name) updateData.name = values.name;
      if (values.email) updateData.email = values.email;
      if (values.password) updateData.password = values.password;
      if (values.designation) updateData.designation = values.designation;
      if (values.phoneNo) updateData.phoneNo = values.phoneNo;
      if (values.department) updateData.department = values.department;

      const payload = {
        empID: values.empID,
        updateData,
      };

      console.log("Update User payload:", payload);

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please log in again.");
        return;
      }

      const res = await updateUser(payload, token);
      message.success(res.data?.message || "User updated successfully!");
      form.resetFields();
      navigate("/home/users");
    } catch (err) {
      console.error("Update user failed:", err.response || err);
      message.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="shadow-xl p-6"
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
        Update User
      </h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Employee ID"
          name="empID"
          rules={[{ required: true, message: "Employee ID is required" }]}
        >
          <Input placeholder="Enter employee ID to update" />
        </Form.Item>

        <Form.Item label="Name" name="name">
          <Input placeholder="Enter new name (optional)" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input placeholder="Enter new email (optional)" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>

        <Form.Item label="Designation" name="designation">
          <Input placeholder="Enter new designation (optional)" />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNo">
          <Input placeholder="Enter new phone number (optional)" />
        </Form.Item>

        <Form.Item label="Department" name="department">
          <Input placeholder="Enter new department (optional)" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full"
        >
          Update User
        </Button>
      </Form>
    </Card>
  );
};

export default UpdateUser;
