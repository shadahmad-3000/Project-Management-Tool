import React, { useState } from "react";
import { forgetPassword } from "../../../utils/UserLogin";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import CButton from "../../../components/common/CButton";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await forgetPassword({ email });
      alert(res.data?.message || "OTP sent successfully!");
      localStorage.setItem("resetEmail", email);
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to reset your password</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <FloatingLabelInput
              label="Email Address"
              inputValue={email}
              onChangeInputText={(val) =>
                setEmail(typeof val === "string" ? val : val.text)
              }
            />
          </div>

          <CButton type="submit" loading={loading} style={{ width: "100%" }}>
            Send OTP
          </CButton>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
