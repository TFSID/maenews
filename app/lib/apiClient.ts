import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://golang-maenews-animae-id2569-ksgm0g96.leapcell.dev/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Global API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);