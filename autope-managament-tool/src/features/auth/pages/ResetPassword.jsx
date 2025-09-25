import React, { useState } from "react";
import { Button, Card, message as antdMessage } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { userResetPassword } from "../../../utils/UserLogin";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return antdMessage.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const email = localStorage.getItem("userEmail");
      await userResetPassword({ email, newPassword });

      antdMessage.success("Password updated successfully! Please login again.");
      localStorage.removeItem("token");
      navigate("/signin", { replace: true });
    } catch (err) {
      antdMessage.error(
        err.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-blue-100">
      <Card
        className="shadow-2xl border border-gray-200 backdrop-blur-md"
        style={{ width: "420px", padding: "32px", borderRadius: "16px" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Set Your Password
          </h2>
          <p className="text-gray-500 text-sm">
            Please create a new password to continue
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative w-full mb-2">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
                 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 h-12 px-3 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <div className="relative w-full mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
                 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 h-12 px-3 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full py-3 rounded-lg text-lg font-semibold 
                       bg-gradient-to-r from-purple-500 to-blue-600 
                       hover:from-blue-600 hover:to-purple-500 
                       transition-all duration-300 shadow-md"
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
