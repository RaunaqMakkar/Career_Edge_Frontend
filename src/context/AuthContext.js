import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Fetch user data with the token
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token'); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/signup', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('/api/users/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setUser(response.data);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      signup, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};