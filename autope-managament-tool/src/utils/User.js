import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/user",
});

export const getUsers = () => {
  const token = localStorage.getItem("token");
  return API.get("/get-user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = (payload, token) => {
  return API.put(
    `/update-user/${payload.empID}`,
    { updateData: payload.updateData },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteUser = (empID, token) => {
  return API.delete(`/delete-user/${empID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserById = (empID, token) => {
  return API.get(`/getuserbyId/${empID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
