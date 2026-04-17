import axios from "axios";

// ================= API INSTANCE =================
const API = axios.create({
  baseURL: "http://localhost:3001"
});

// ================= TYPES =================

export interface StartInterviewRequest {
  role: string;
  level: string;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  answer: string | string[];
}

// ================= API FUNCTIONS =================

export const startInterview = (data: StartInterviewRequest) =>
  API.post("/start", data);

export const submitAnswer = (data: SubmitAnswerRequest) =>
  API.post("/answer", data);

export const getResult = (sessionId: string) =>
  API.get(`/result/${sessionId}`);