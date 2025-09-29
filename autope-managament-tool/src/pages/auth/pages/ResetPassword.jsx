import React, { useState } from "react";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { userChangePassword } from "../../../utils/UserLogin";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import CButton from "../../../components/common/CButton";

const ResetPassword = () => {
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
      console.error("Password reset failed:", err);
      alert(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background:
          "linear-gradient(to bottom right, #f3e8ff, #ffffff, #dbeafe)",
      }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "420px", borderRadius: "16px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Set Your Password</h2>
          <p className="text-muted small">
            Please create a new password to continue
          </p>
        </div>

        <form onSubmit={handleReset}>
          <div className="mb-3 position-relative">
            <FloatingLabelInput
              label="New Password"
              inputValue={newPassword}
              onChangeInputText={(val) =>
                setNewPassword(typeof val === "string" ? val : val.text)
              }
              secureTextEntry={!showNewPassword}
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              {showNewPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <div className="mb-4 position-relative">
            <FloatingLabelInput
              label="Confirm Password"
              inputValue={confirmPassword}
              onChangeInputText={(val) =>
                setConfirmPassword(typeof val === "string" ? val : val.text)
              }
              secureTextEntry={!showConfirmPassword}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <CButton
            type="submit"
            loading={loading}
            style={{ width: "100%", padding: "12px", fontSize: "16px" }}
          >
            Reset Password
          </CButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
