import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUserById, updateUser } from "../../../utils/User";
import { addUsers } from "../../../utils/superAdmin";

const AddEditUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigate = useNavigate();
  const { empID } = useParams();
  const location = useLocation();

  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    if (isEditMode && empID) {
      const fetchUser = async () => {
        setInitialLoading(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            message.error("No token found. Please log in again.");
            return;
          }
          const res = await getUserById(empID, token);
          if (res.data?.data) {
            form.setFieldsValue(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          message.error(err.response?.data?.message || "Failed to fetch user");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchUser();
    }
  }, [empID, isEditMode, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please log in again.");
        return;
      }

      if (isEditMode) {
        const payload = { empID, updateData: values };
        const res = await updateUser(payload, token);
        message.success(res.data?.message || "User updated successfully!");
      } else {
        const res = await addUsers(values, token);
        message.success(res.data?.message || "User created successfully!");
      }

      form.resetFields();
      navigate("/home/users");
    } catch (err) {
      console.error("User save failed:", err.response || err);
      message.error(err.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Spin size="large" />;
  }

  return (
    <Card
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
      >
        Back
      </Button>
      <h2>{isEditMode ? "Edit User" : "Add New User"}</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        {!isEditMode && (
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        <Form.Item
          label="Employee ID"
          name="empID"
          rules={[{ required: true, message: "Employee ID is required" }]}
        >
          <Input placeholder="Enter employee ID" disabled={isEditMode} />
        </Form.Item>

        <Form.Item label="Designation" name="designation">
          <Input placeholder="Enter designation" />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNo">
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item label="Department" name="department">
          <Input placeholder="Enter department" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          {isEditMode ? "Update User" : "Create User"}
        </Button>
      </Form>
    </Card>
  );
};

export default AddEditUser;
