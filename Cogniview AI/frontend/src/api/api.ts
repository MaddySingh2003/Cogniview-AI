import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001"
});

// ✅ FIXED TOKEN HANDLING
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ⚠️ keep this (no Bearer)
  }

  return config;
});

export const startInterview = (data: any) => {
  const isFormData = data instanceof FormData;

  return API.post("/start", data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : {}
  });
};
export const submitAnswer = (data: any) =>
  API.post("/answer", data);

export const getResult = (sessionId: string) =>
  API.get(`/result/${sessionId}`);

export const login = (data: any) =>
  API.post("/auth/login", data);

export const register = (data: any) =>
  API.post("/auth/register", data);
export const getHistory=()=>
  API.get("/history");
export const liveEvaluate=(data:any)=>
{
  axios.post("http://localhost:3001/live-eval",data,);
}
export default API;