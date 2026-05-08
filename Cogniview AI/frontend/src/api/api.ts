import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

// ================= TOKEN =================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= AUTO LOGOUT =================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn("JWT expired or unauthorized");

      localStorage.removeItem("token");

      // prevent infinite reload loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ================= START INTERVIEW =================
export const startInterview = (formData: FormData) =>
  API.post("/start", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

// ================= SUBMIT ANSWER =================
export const submitAnswer = (data: any) =>
  API.post("/answer", data);

// ================= RESULT =================
export const getResult = (sessionId: string) =>
  API.get(`/result/${sessionId}`);

// ================= AUTH =================
export const login = (data: any) =>
  API.post("/auth/login", data);

export const register = (data: any) =>
  API.post("/auth/register", data);

// ================= HISTORY =================
export const getHistory = () =>
  API.get("/history");

// ================= LIVE EVALUATION =================
export const liveEvaluate = (data: any) =>
  API.post("/live-eval", data);

export default API;