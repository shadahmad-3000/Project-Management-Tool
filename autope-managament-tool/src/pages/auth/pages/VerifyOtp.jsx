import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtp, resendOtp } from "../../../store/slices/otpSlice";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email =
    location.state?.email || localStorage.getItem("resetEmail") || "";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email missing. Please restart password reset flow.");
      return;
    }

    setLoading(true);

    dispatch(verifyOtp({ email, otp }))
      .unwrap()
      .then((response) => {
        alert(response?.message || "OTP verified successfully!");
        navigate("/change-password", { replace: true });
      })
      .catch((err) => {
        alert(err || "Invalid OTP");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResendOtp = () => {
    if (!email) {
      alert("Email missing. Please restart password reset flow.");
      return;
    }

    setResendLoading(true);

    dispatch(resendOtp({ email }))
      .unwrap()
      .then((response) => {
        alert(response?.message || "OTP resent!");
        setTimer(300);
      })
      .catch((err) => {
        alert(err || "Failed to resend OTP.");
      })
      .finally(() => {
        setResendLoading(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Verify OTP</h2>
        <p className="auth-subtitle">
          We sent an OTP to <b>{email}</b>. Enter it below to verify your
          account.
        </p>

        <form onSubmit={handleVerifyOtp}>
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
            <CButton
              type="submit"
              style={{ width: "100%" }}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </CButton>
          </div>
        </form>

        <CButton
          onClick={handleResendOtp}
          disabled={timer > 0 || resendLoading}
          style={{ width: "100%" }}
          variant="text"
        >
          {resendLoading
            ? "Resending..."
            : timer > 0
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
