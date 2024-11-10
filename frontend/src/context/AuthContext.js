import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/axios.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = (event) => {
      // console.log("Session expired event received:", event.detail.message);
      setIsAuthenticated(false);
      navigate("/", {
        state: {
          message: event.detail.message,
          type: "warning",
        },
      });
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, [navigate]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await api.post("/auth/refresh-token", { refreshToken });
      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      return accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        checkAuth,
        setAuth: setIsAuthenticated,
        refreshAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
