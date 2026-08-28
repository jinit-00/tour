import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleOAuthToken(token);
      navigate('/dashboard');
    } else {
      navigate('/login?error=OAuthFailed');
    }
  }, [searchParams, handleOAuthToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center text-cream-300 font-mono">
      Authenticating with Google OAuth...
    </div>
  );
}
