import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/team",
});

export const createTeam = (teamData, token) =>
  API.post("/create-team", teamData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTeam = (payload, token) =>
  API.post("/update-team", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTeams = (token) =>
  API.get("/get-teams", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTeamById = (teamCode, token) => {
  return API.get(`/getteamsbyId/${teamCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
