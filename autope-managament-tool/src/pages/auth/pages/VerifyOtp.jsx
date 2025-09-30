import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userResendOtp, userVerifyOtp } from "../../../utils/OtpVerification";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email =
    location.state?.email || localStorage.getItem("resetEmail") || "";
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async () => {
    try {
      if (!email) {
        alert("Email missing. Please restart password reset flow.");
        return;
      }

      const res = await userVerifyOtp({ email, otp });
      alert(res.data?.message || "OTP verified successfully!");

      navigate("/change-password", { replace: true }); // ✅ Go to ChangePassword.jsx
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await userResendOtp(email);
      alert(res.data.message || "OTP resent!");
      setTimer(300);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Verify OTP</h2>
        <p className="auth-subtitle">
          We sent an OTP to <b>{email}</b>. Enter it below to verify your
          account.
        </p>

        <div className="form-group">
          <FloatingLabelInput
            label="Enter OTP"
            inputValue={otp}
            onChangeInputText={(val) =>
              setOtp(typeof val === "string" ? val : val.text)
            }
          />
        </div>

        <div className="form-group">
          <CButton onClick={handleVerifyOtp} style={{ width: "100%" }}>
            Verify OTP
          </CButton>
        </div>

        <CButton
          onClick={handleResendOtp}
          disabled={timer > 0}
          style={{ width: "100%" }}
          variant="text"
        >
          {timer > 0
            ? `Resend in ${Math.floor(timer / 60)}:${String(
                timer % 60
              ).padStart(2, "0")}`
            : "Resend OTP"}
        </CButton>
      </div>
    </div>
  );
};

export default VerifyOtp;
