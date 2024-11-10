// utils/tokenDebug.js
import { jwtDecode } from "jwt-decode";

export const checkTokenStatus = () => {
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  console.log("Token Status Check:");

  if (accessToken) {
    const accessDecoded = jwtDecode(accessToken);
    console.log("Access Token:", {
      expires: new Date(accessDecoded.exp * 1000),
      timeUntilExpiry: accessDecoded.exp - Math.floor(Date.now() / 1000),
      isExpired: accessDecoded.exp < Math.floor(Date.now() / 1000),
    });
  } else {
    console.log("No access token found");
  }

  if (refreshToken) {
    const refreshDecoded = jwtDecode(refreshToken);
    console.log("Refresh Token:", {
      expires: new Date(refreshDecoded.exp * 1000),
      timeUntilExpiry: refreshDecoded.exp - Math.floor(Date.now() / 1000),
      isExpired: refreshDecoded.exp < Math.floor(Date.now() / 1000),
    });
  } else {
    console.log("No refresh token found");
  }
};
