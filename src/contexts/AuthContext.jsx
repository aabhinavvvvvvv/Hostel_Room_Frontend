import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get API URL for logging/debugging
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    let isMounted = true;
    
    // Add a safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth check timed out, setting loading to false');
        setLoading(false);
      }
    }, 15000); // 15 second max wait

    checkAuth().finally(() => {
      if (isMounted) {
        clearTimeout(timeoutId);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        // If response is not successful, clear user
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error.message);
      console.error('API URL:', API_URL);
      console.error('Error details:', error.response?.status, error.response?.data);
      
      // Only clear user if it's a 401 (unauthorized), not for network errors
      // This prevents clearing user state immediately after login due to network issues
      if (error.response?.status === 401) {
        setUser(null);
      }
      // For other errors (network, timeout, etc.), keep current user state if it exists
    } finally {
      // Always set loading to false, even if there's an error
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        // Set user immediately after successful login
        setUser(response.data.user);
        
        // Verify the login by checking auth status
        // Wait a bit for cookie to be set
        setTimeout(async () => {
          try {
            const verifyResponse = await api.get('/auth/me');
            if (verifyResponse.data.success) {
              setUser(verifyResponse.data.user);
            }
          } catch (verifyError) {
            console.warn('Auth verification after login failed:', verifyError.message);
            // Don't clear user - cookie might still be setting
          }
        }, 500);
        
        toast.success('Login successful');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, universityId) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        universityId,
      });
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Registration successful');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

