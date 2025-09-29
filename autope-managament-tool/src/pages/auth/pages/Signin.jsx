import React, { useState } from "react";
import { userSignin } from "../../../utils/UserLogin";
import { userSendOtp } from "../../../utils/OtpVerification";
import { Link, useNavigate } from "react-router-dom";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

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

      alert(backendMessage);

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
          alert("We sent you an OTP. Please verify your account.");
          navigate("/verify-otp", {
            state: { email: credentials.email },
            replace: true,
          });
        } catch {
          alert("Failed to send OTP. Please try again.");
        }
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "420px",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "16px",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Welcome back!</h2>
          <p className="text-muted small">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <FloatingLabelInput
              label="Email address"
              inputValue={credentials.email}
              onChangeInputText={(val) =>
                handleChange("email", typeof val === "string" ? val : val.text)
              }
              keyboardType="email"
            />
          </div>

          <div className="mb-3 position-relative">
            <FloatingLabelInput
              label="Password"
              inputValue={credentials.password}
              onChangeInputText={(val) =>
                handleChange(
                  "password",
                  typeof val === "string" ? val : val.text
                )
              }
              secureTextEntry={!showPassword}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <div className="text-end mb-3">
            <Link to="/forgot-password" className="small">
              Forgot password?
            </Link>
          </div>

          <CButton type="submit" loading={loading} style={{ width: "100%" }}>
            Login
          </CButton>
        </form>

        {loading && (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;
