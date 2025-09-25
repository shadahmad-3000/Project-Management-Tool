import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/auth",
});

export const userSignup = (userData) => API.post("/sign-up", userData);

export const userSignin = (credentials) => API.post("/sign-in", credentials);

export const userLogout = async (token, email) => {
  return API.post(
    "/log-out",
    { email },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const userResetPassword = (payload) => {
  return API.post("/reset-password", payload);
};
