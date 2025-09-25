import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Card, message as antdMessage } from "antd";
import { userResendOtp, userVerifyOtp } from "../../../utils/OtpVerification";

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
    <div className="flex justify-center items-center min-h-screen w-screen bg-[#1f1f1f] px-4 py-8">
      <Card
        className="shadow-xl p-6"
        style={{
          width: "400px",
          backgroundColor: "#1f1f1f",
          color: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        <p className="text-gray-300 mb-4">
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

        <Button type="primary" block className="mt-4" onClick={handleVerifyOtp}>
          Verify OTP
        </Button>

        <Button
          block
          disabled={timer > 0}
          className="mt-2"
          onClick={handleResendOtp}
        >
          {timer > 0
            ? `Resend in ${Math.floor(timer / 60)}:${String(
                timer % 60
              ).padStart(2, "0")}`
            : "Resend OTP"}
        </Button>
      </Card>
    </div>
  );
};

export default VerifyOtp;
