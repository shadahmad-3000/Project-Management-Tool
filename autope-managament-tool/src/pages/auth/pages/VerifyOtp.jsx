import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Card, message as antdMessage } from "antd";
import { userResendOtp, userVerifyOtp } from "../../../utils/OtpVerification";
import CButton from "../../../components/common/CButton";

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
      antdMessage.success(res.data.message || "OTP verified!");
      navigate("/signin", { replace: true });
    } catch (err) {
      console.error("Verify OTP error:", err);
      antdMessage.error(
        err.response?.data?.message || "OTP verification failed."
      );
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await userResendOtp(email);
      antdMessage.success(res.data.message || "OTP resent!");
      setTimer(300);
    } catch (err) {
      console.error("Resend OTP error:", err);
      antdMessage.error(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div>
      <Card
        style={{
          width: "400px",
          backgroundColor: "#1f1f1f",
          color: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <h2>Verify OTP</h2>

        <p>
          We sent an OTP to <b>{email}</b>. Enter it below to verify your
          account.
        </p>

        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{
            backgroundColor: "#1f1f1f",
            color: "#f5f5f5",
            border: "1px solid #333",
          }}
        />

        <CButton onClick={handleVerifyOtp} style={{ width: "100%" }}>
          Verify OTP
        </CButton>

        <CButton
          onClick={handleResendOtp}
          disabled={timer > 0}
          style={{ width: "100%" }}
        >
          {timer > 0
            ? `Resend in ${Math.floor(timer / 60)}:${String(
                timer % 60
              ).padStart(2, "0")}`
            : "Resend OTP"}
        </CButton>
      </Card>
    </div>
  );
};

export default VerifyOtp;
