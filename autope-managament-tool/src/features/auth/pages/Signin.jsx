import React, { useState } from "react";
import { userSignin } from "../../../utils/UserLogin";
import { userSendOtp } from "../../../utils/OtpVerification";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Card, Spin, message as antdMessage } from "antd";
import AutopeLogo from "../../../assets/Autope_Textless_Logo.png";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const Signin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setCredentials((c) => ({ ...c, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userSignin(credentials);
      const backendMessage = res.data?.message || "Login successful!";

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", credentials.email);
      }
      if (res.data?.role) localStorage.setItem("userRole", res.data.role);
      if (res.data?.userId) localStorage.setItem("userId", res.data.userId);

      antdMessage.success(res.data.message, 3);

      if (res.data.forcePasswordChange) {
        navigate("/reset-password", {
          replace: true,
          state: { oldPassword: credentials.password },
        });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signin failed.";
      if (
        errorMsg.includes("Please verify your email with OTP") &&
        credentials.email
      ) {
        try {
          await userSendOtp(credentials.email);
          antdMessage.info("We sent you an OTP. Please verify your account.");
          navigate("/verify-otp", {
            state: { email: credentials.email },
            replace: true,
          });
        } catch {
          antdMessage.error("Failed to send OTP. Please try again.");
        }
      } else {
        antdMessage.error(errorMsg, 3);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-br from-purple-50 via-white to-blue-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
        }}
      ></div>

      <div className="relative z-20 flex justify-center items-center min-h-screen px-4">
        <Card
          className="shadow-2xl border border-gray-200 backdrop-blur-md"
          style={{
            width: "420px",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
               focus:border-purple-500 focus:ring-2 focus:ring-purple-400 h-12 px-3"
                />
              </div>
            </div>

            <div className="relative w-full mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
               focus:border-purple-500 focus:ring-2 focus:ring-purple-400 h-12 px-3 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            </div>

            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Forgot password?
              </Link>
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
              Login
            </Button>
          </form>

          {loading && (
            <div className="flex justify-center mt-4">
              <Spin />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Signin;
