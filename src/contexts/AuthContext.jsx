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
  const [justLoggedIn, setJustLoggedIn] = useState(false);

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
    // Don't check auth if we just logged in (give cookie time to be set)
    if (justLoggedIn) {
      console.log('Skipping auth check - just logged in');
      setLoading(false);
      return;
    }

    // If we already have a user, don't clear it on network errors
    const hadUser = !!user;

    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        // If response is not successful, only clear user if we didn't just log in
        if (!justLoggedIn) {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error.message);
      console.error('API URL:', API_URL);
      console.error('Error details:', error.response?.status, error.response?.data);
      console.error('Cookies during auth check:', document.cookie);
      
      // Only clear user if it's a 401 (unauthorized) AND we didn't just log in
      // AND we didn't have a user before (to prevent clearing user on network errors)
      if (error.response?.status === 401 && !justLoggedIn && !hadUser) {
        console.log('Clearing user due to 401 error');
        setUser(null);
      } else if (error.response?.status === 401 && justLoggedIn) {
        console.log('Got 401 but just logged in - keeping user state');
        // Keep user state - cookie might still be setting
      } else {
        console.log('Keeping user state despite error');
        // For other errors (network, timeout, etc.), keep current user state if it exists
      }
    } finally {
      // Always set loading to false, even if there's an error
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        // Set flag to prevent auth check from clearing user
        setJustLoggedIn(true);
        
        // Set user immediately after successful login
        setUser(response.data.user);
        
        console.log('Login successful, user set:', response.data.user);
        console.log('Cookies after login:', document.cookie);
        
        toast.success('Login successful');
        
        // Clear the flag after a longer delay to allow cookie to be set and verified
        // This prevents checkAuth from clearing user state immediately
        setTimeout(() => {
          // Verify the login after cookie should be set
          api.get('/auth/me')
            .then((verifyResponse) => {
              if (verifyResponse.data.success) {
                console.log('Auth verification successful');
                setUser(verifyResponse.data.user);
              } else {
                console.warn('Auth verification returned unsuccessful response');
                // Keep user state from login - don't clear it
              }
            })
            .catch((verifyError) => {
              console.warn('Auth verification after login failed:', verifyError.message);
              console.warn('Error status:', verifyError.response?.status);
              console.warn('Cookies during verification:', document.cookie);
              // Don't clear user - keep the user state from login response
              // The cookie might still be setting or there might be a network issue
            })
            .finally(() => {
              // Clear the flag after verification attempt
              setJustLoggedIn(false);
            });
        }, 2000); // Wait 2 seconds for cookie to be set
        
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

