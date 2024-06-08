import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Use an interceptor to inject the token before each request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response, // Simply return the response for successful requests
  error => {
    // Check if we received a 401 response, which indicates an unauthorized request
    if (error.response && error.response.status === 401) {
      // Redirect the user to the login page
      // If using React Router, you might replace the line below with history.push('/login');
      window.location.href = '/';
    }

    // Return a rejected promise to maintain the promise chain
    return Promise.reject(error);
  }
);

export default api;
