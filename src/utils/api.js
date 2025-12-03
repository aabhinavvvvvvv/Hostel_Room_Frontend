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
    // Always log cookie status for debugging (especially in production)
    const cookies = document.cookie;
    const hasTokenCookie = cookies.includes('token=');
    
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      hasCookies: cookies.length > 0,
      hasTokenCookie: hasTokenCookie,
      cookieString: cookies.substring(0, 100), // First 100 chars for debugging
    });
    
    // Warn if cookie is missing for authenticated endpoints
    if (!hasTokenCookie && config.url && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
      console.warn('⚠️ No token cookie found for request:', config.url);
      console.warn('Available cookies:', cookies || 'None');
    }
    
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

