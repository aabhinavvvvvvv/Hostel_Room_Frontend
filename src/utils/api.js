import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      // This prevents redirect loops and allows AuthContext to handle the state
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Don't redirect immediately - let AuthContext handle it
        // This prevents instant logout after login
        console.warn('Unauthorized request, but not redirecting to avoid logout loop');
      }
    } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('API connection error:', error.message);
      console.error('API URL:', API_URL);
    }
    return Promise.reject(error);
  }
);

export default api;

