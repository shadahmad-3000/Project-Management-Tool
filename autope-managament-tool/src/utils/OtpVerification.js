import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/otp",
});

export const userSendOtp = (email) => API.post("/sent-otp", { email });
export const userResendOtp = (email) => API.post("/resend-otp", { email });
export const userVerifyOtp = (email, otp) => API.post("/verify-otp", { email, otp });