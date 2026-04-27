import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL || 'https://sukumarbeverages.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const stored = localStorage.getItem('aw_user');
        if (stored) {
          const u = JSON.parse(stored);
          // Validate token expiry if present
          if (u.token) {
            setUser(u);
            api.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
            axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
          } else {
            localStorage.removeItem('aw_user');
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        localStorage.removeItem('aw_user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Axios response interceptor for 401 handling
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Token expired or invalid - logout user
          logout();

          // Optionally: redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const sendOtp = async (email, phone, name) => {
    try {
      const { data } = await api.post('/auth/send-otp', { email, phone, name });
      return data;
    } catch (err) {
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Store user data
      localStorage.setItem('aw_user', JSON.stringify(data));

      // Set auth headers globally
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      setUser(data);
      return data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', formData);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('aw_user');
    delete api.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  // RBAC helpers
  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isDistributor = useCallback(() => user?.role === 'distributor', [user]);
  const isDelivery = useCallback(() => user?.role === 'delivery', [user]);
  const isCustomer = useCallback(() => user?.role === 'customer' || !user?.role, [user]);
  const hasRole = useCallback((role) => user?.role === role, [user]);
  const hasAnyRole = useCallback((roles) => roles.includes(user?.role), [user]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => !!user?.token, [user]);

  const value = {
    user,
    login,
    register,
    sendOtp,
    logout,
    loading,
    API,
    api,
    // RBAC
    isAdmin,
    isDistributor,
    isDelivery,
    isCustomer,
    hasRole,
    hasAnyRole,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

