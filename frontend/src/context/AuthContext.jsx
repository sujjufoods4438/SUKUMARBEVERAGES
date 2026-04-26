import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Set VITE_API_URL in Netlify environment variables to your deployed backend URL.

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('aw_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
    }
    setLoading(false);
  }, []);

  const sendOtp = async (email, phone, name) => {
    const { data } = await axios.post(`${API}/auth/send-otp`, { email, phone, name });
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('aw_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await axios.post(`${API}/auth/register`, formData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('aw_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, sendOtp, logout, loading, API }}>
      {children}
    </AuthContext.Provider>
  );
};
