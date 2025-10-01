import React, { useState } from "react";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import CButton from "../../../components/common/CButton";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../../utils/UserLogin";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = localStorage.getItem("resetEmail");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    dispatch(resetPassword({ email, newPassword }))
      .unwrap()
      .then(() => {
        alert("Password reset successfully!");
        localStorage.removeItem("resetEmail");
        navigate("/signin");
      })
      .catch((err) => {
        alert(err || "Failed to reset password");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Set New Password</h2>
        <p className="auth-subtitle">Enter your new password to continue</p>

        <form onSubmit={handleSubmit}>
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
            Change Password
          </CButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
