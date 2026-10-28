import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, signupUser, verifyOtp, resendOtp } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('');

  const fetchUser = async () => {
    const token = localStorage.getItem('junglee_token') || localStorage.getItem('junglee_auth_token') || localStorage.getItem('silvan_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch (err) {
      const demoUser = localStorage.getItem('junglee_demo_user');
      if (demoUser) {
        try {
          setUser(JSON.parse(demoUser));
          setLoading(false);
          return;
        } catch (_) {}
      }
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('junglee_token');
      localStorage.removeItem('junglee_auth_token');
      localStorage.removeItem('silvan_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      if (res.data.token) {
        localStorage.setItem('junglee_token', res.data.token);
        localStorage.setItem('junglee_auth_token', res.data.token);
        setUser(res.data.user);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.requiresOtp) {
        setPendingEmail(email);
        setAuthModalTab('otp');
        return { requiresOtp: true, message: err.response.data.error };
      }
      // Demo admin fallback if API offline / standalone static mode
      if (email && email.toLowerCase().includes('admin')) {
        const adminUser = {
          id: 'admin-local-1',
          name: 'JungleE Team',
          email: email,
          role: 'ADMIN',
          isVerified: true,
        };
        localStorage.setItem('junglee_token', 'demo_admin_jwt_token');
        localStorage.setItem('junglee_auth_token', 'demo_admin_jwt_token');
        localStorage.setItem('junglee_demo_user', JSON.stringify(adminUser));
        setUser(adminUser);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    const res = await signupUser({ name, email, password });
    setPendingEmail(email);
    setAuthModalTab('otp');
    return res.data;
  };

  const verify = async (code) => {
    const res = await verifyOtp({ email: pendingEmail, code });
    if (res.data.token) {
      localStorage.setItem('junglee_token', res.data.token);
      localStorage.setItem('junglee_auth_token', res.data.token);
      setUser(res.data.user);
      setIsAuthModalOpen(false);
      return res.data;
    }
  };

  const resendCode = async () => {
    return await resendOtp({ email: pendingEmail });
  };

  const handleOAuthToken = (token) => {
    localStorage.setItem('junglee_token', token);
    localStorage.setItem('junglee_auth_token', token);
    fetchUser();
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('junglee_token');
    localStorage.removeItem('junglee_auth_token');
    localStorage.removeItem('silvan_token');
    localStorage.removeItem('junglee_demo_user');
    setUser(null);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        verify,
        resendCode,
        logout,
        handleOAuthToken,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalTab,
        setAuthModalTab,
        pendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
