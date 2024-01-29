import axios from 'axios';

// Create an Axios instance with custom configurations
const api = axios.create({
  baseURL: 'http://localhost:3001/api/',
});

// Get the user token from local storage or cookies
const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");

if (userToken) {
  // Set the token in Axios instance headers
  api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
}

export default api;

