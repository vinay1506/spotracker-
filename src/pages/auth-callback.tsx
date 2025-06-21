import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Helper to decode base64-encoded JSON
function decodeToken(token: string) {
  try {
    const json = atob(token);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const AuthCallbackPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("Token received, logging in...");
      login(token);
      // Navigate to the dashboard after a short delay to ensure context is updated
      setTimeout(() => navigate('/dashboard'), 100);
    } else {
      console.error("No token found in URL, redirecting to login.");
      // Handle case where there's no token
      navigate('/');
    }
  }, [login, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authenticating...</h1>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage; 