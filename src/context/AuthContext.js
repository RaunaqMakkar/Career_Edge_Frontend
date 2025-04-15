import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Fetch user data with the token
        const response = await api.get('/api/users/profile'); // Added /api prefix
        
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
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
      const response = await api.post('/api/auth/login', { email, password }); // Added /api prefix
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Changed from 'token' to 'authToken'
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
      const response = await api.post('/api/auth/signup', userData); // Added /api prefix
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Changed from 'token' to 'authToken'
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
    localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      const response = await api.put('/api/users/profile', profileData); // Added /api prefix
      
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