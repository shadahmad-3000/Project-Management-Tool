import React, { useState } from "react";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { userChangePassword } from "../../../utils/UserLogin";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import CButton from "../../../components/common/CButton";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const email = localStorage.getItem("userEmail");
      const oldPassword = location.state?.oldPassword;

      await userChangePassword({ email, newPassword, oldPassword });

      alert("Password updated successfully! Please login again.");
      localStorage.removeItem("token");
      navigate("/signin", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2 className="auth-title">Set Your Password</h2>
          <p className="auth-subtitle">
            Please create a new password to continue
          </p>
        </div>

        <form onSubmit={handleReset}>
          <div className="form-group position-relative">
            <FloatingLabelInput
              label="New Password"
              inputValue={newPassword}
              onChangeInputText={(val) =>
                setNewPassword(typeof val === "string" ? val : val.text)
              }
              secureTextEntry={!showNewPassword}
            />
            <span
              className="form-password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <div className="form-group position-relative">
            <FloatingLabelInput
              label="Confirm Password"
              inputValue={confirmPassword}
              onChangeInputText={(val) =>
                setConfirmPassword(typeof val === "string" ? val : val.text)
              }
              secureTextEntry={!showConfirmPassword}
            />
            <span
              className="form-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <CButton type="submit" loading={loading} style={{ width: "100%" }}>
            Reset Password
          </CButton>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
