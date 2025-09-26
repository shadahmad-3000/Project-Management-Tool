import React, { useState } from "react";
import { userSignin } from "../../../utils/UserLogin";
import { userSendOtp } from "../../../utils/OtpVerification";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Spin, message as antdMessage } from "antd";
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

      antdMessage.success(backendMessage, 3);

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
    <div>
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
        }}
      ></div>

      <div>
        <Card
          style={{
            width: "420px",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <div>
            <h2>Welcome back!</h2>
            <p>Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            </div>

            <div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
          </form>

          {loading && (
            <div>
              <Spin />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Signin;
