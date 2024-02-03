import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/',
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

export default api;
