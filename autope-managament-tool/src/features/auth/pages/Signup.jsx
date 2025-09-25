import React, { useState } from "react";
import { userSignup } from "../../../utils/UserLogin";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message as antdMessage } from "antd";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        empID: values.empID,
        phoneNo: values.phoneNo,
      };

      console.log("Signup payload:", payload);
      const res = await userSignup(payload);
      console.log("Signup response:", res);

      antdMessage.success(res.data.message || "Signup successful!");

      navigate("/verify-otp", {
        state: { email: values.email },
        replace: true,
      });
    } catch (err) {
      console.error("Signup error:", err);
      antdMessage.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
      <Card
        className="shadow-2xl border border-gray-200"
        style={{
          width: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          color: "#1f2937",
          borderRadius: "16px",
        }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-600">
          Create an Account
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-5"
        >
          <Form.Item
            label={<span className="text-gray-700">Name</span>}
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input
              placeholder="Enter your name"
              className="rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              placeholder="Enter your email"
              className="rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Employee ID</span>}
            name="empID"
            rules={[{ required: true, message: "Employee ID is required" }]}
          >
            <Input
              placeholder="Enter your employee ID"
              className="rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Password</span>}
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Phone Number</span>}
            name="phoneNo"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input
              placeholder="Enter your phone number"
              className="rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Designation</span>}
            name="designation"
            rules={[{ required: true, message: "Designation is required" }]}
          >
            <Input
              placeholder="Enter your designation"
              className="rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full py-2 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 shadow-md"
          >
            Sign Up
          </Button>
        </Form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 font-medium hover:text-indigo-600 transition duration-200"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
