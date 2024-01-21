// src/components/reusable/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', 
});

// Optionally add interceptors for request/response
instance.interceptors.request.use(config => {
  // Perform actions before request is sent
  return config;
}, error => {
  // Handle request error
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  // Perform actions on response data
  return response;
}, error => {
  // Handle response error
  return Promise.reject(error);
});

export default instance;
