import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userResendOtp, userVerifyOtp } from "../../../utils/OtpVerification";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
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
      const res = await userVerifyOtp(email, otp);
      alert(res.data.message || "OTP verified!");
      navigate("/signin", { replace: true });
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await userResendOtp(email);
      alert(res.data.message || "OTP resent!");
      setTimer(300);
    } catch (err) {
      console.error("Resend OTP error:", err);
      alert(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow p-4"
        style={{
          width: "400px",
          backgroundColor: "#1f1f1f",
          color: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <h2 className="mb-3 text-white">Verify OTP</h2>

        <p className="mb-4">
          We sent an OTP to <b>{email}</b>. Enter it below to verify your
          account.
        </p>

        <div className="mb-3">
          <FloatingLabelInput
            label="Enter OTP"
            inputValue={otp}
            onChangeInputText={(val) =>
              setOtp(typeof val === "string" ? val : val.text)
            }
            inputStyle={{
              backgroundColor: "#1f1f1f",
              color: "#f5f5f5",
            }}
            containerStyle={{
              border: "1px solid #333",
            }}
          />
        </div>

        <div className="mb-3">
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
