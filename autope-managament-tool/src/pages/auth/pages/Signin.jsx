import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { useDispatch } from "react-redux";
import { signin } from "../../../store/slices/authSlice";
import { sendOtp } from "../../../store/slices/otpSlice";

const Signin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    setCredentials((c) => ({ ...c, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(signin(credentials))
      .unwrap()
      .then((response) => {
        const backendMessage = response?.message || "Login successful!";

        if (response?.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userEmail", credentials.email);
        }
        if (response?.role) localStorage.setItem("userRole", response.role);
        if (response?.userId) localStorage.setItem("userId", response.userId);

        alert(backendMessage);

        if (response.forcePasswordChange) {
          navigate("/change-password", {
            replace: true,
            state: { oldPassword: credentials.password },
          });
        } else {
          navigate("/home", { replace: true });
        }

        setLoading(false);
      })
      .catch(async (err) => {
        const errorMsg = err || "Signin failed.";

        if (
          errorMsg.includes("Please verify your email with OTP") &&
          credentials.email
        ) {
          try {
            await dispatch(sendOtp({ email: credentials.email })).unwrap();
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

        setLoading(false);
      });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>Welcome back!</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <FloatingLabelInput
              label="Email address"
              inputValue={credentials.email}
              onChangeInputText={(val) =>
                handleChange("email", typeof val === "string" ? val : val.text)
              }
              keyboardType="email"
            />
          </div>

          <div className="form-group password-group">
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
              className="password-toggle"
            >
              {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <CButton type="submit" loading={loading} style={{ width: "100%" }}>
            Login
          </CButton>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner-border" role="status"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;
