import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create a separate axios instance for refresh token requests
const refreshAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log("Response error:", error.response?.status);
    // console.log("Original request URL:", originalRequest.url);

    // Check if error is 401 and not from the refresh token endpoint
    if (
      error.response?.status !== 401 ||
      originalRequest.url === "/auth/refresh-token" ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // console.log("Token expired, attempting refresh...");

    if (isRefreshing) {
      // console.log("Refresh already in progress, queueing request");
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          // console.log("Queue processed, retrying with new token");
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          // console.log("Queue processing failed:", err);
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // console.log("Making refresh token request");
      // Use the separate axios instance for refresh
      const response = await refreshAxios.post("/auth/refresh-token", {
        refreshToken,
      });

      // console.log("Refresh token response:", response.data);
      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);

      // Process any queued requests
      processQueue(null, accessToken);

      // Update the failed request's authorization header
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

      // console.log("Retrying original request with new token");
      return api(originalRequest);
    } catch (err) {
      // console.log("Token refresh failed:", err);
      processQueue(err, null);

      // Only clear tokens and redirect if refresh token is invalid
      if (err.response?.status === 401) {
        // console.log("Refresh token invalid, logging out");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");

        // Dispatch an event instead of direct redirect
        const event = new CustomEvent("sessionExpired", {
          detail: { message: "Session expired. Please login again." },
        });
        window.dispatchEvent(event);
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
