import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const getAuthHeaders = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    key: "sync",
    Authorization: "",
  };
  if (token && token?.length > 0) {
    //   const accessToken = decryptMessage(token);
    headers.Authorization = "Bearer " + token;
  }
  return Object.keys(headers).length ? headers : {};
};
const api = axios.create();

// // Intercept all responses to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized: Invalid session.");
      // Clear local storage and redirect to a session-expired page
      localStorage.removeItem(ACCESS_TOKEN);
      // localStorage.removeItem("apiKey");
      window.location.href = `${
        import.meta.env.REACT_APP_BASE_URL || "/dmrc-web"
      }/session-expired`;
    }
    return Promise.reject(error);
  }
);

export const getRequest = async (url, params = {}, pathParams = {}) => {
  try {
    const headers = getAuthHeaders();
    let finalUrl = url;
    for (const key in pathParams) {
      finalUrl = finalUrl.replace(`:${key}`, pathParams[key]);
    }
    // console.log(`Making GET request to: ${url} with params:`, params);
    const response = await api.get(finalUrl, { params, headers });
    return response;
  } catch (error) {
    // console.error("GET request failed:", error);
    throw error;
  }
};

export const postRequest = async (url, data = {}) => {
  try {
    const headers = getAuthHeaders();
    // console.log(`Making POST request to: ${url} with data:`, data);
    // console.log("POST headers being sent:", headers);
    const response = await api.post(url, data, { headers });
    return response;
  } catch (error) {
    // console.error("POST request failed:", error);
    throw error;
  }
};

export const putRequest = async (url, data = {}) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.put(url, data, { headers });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteRequest = async (url) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.delete(url, { headers });
    return response;
  } catch (error) {
    throw error;
  }
};
