import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'https://spostats-backend-production.up.railway.app';

const AuthCallbackPage = () => {
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Send token to backend to establish session
      axios.post(`${API_BASE_URL}/auth/session`, { token }, { withCredentials: true })
        .then(() => {
          setAuthenticated(true); // update context
          navigate('/dashboard');
        })
        .catch(() => {
          setAuthenticated(false);
          navigate('/');
        });
    } else {
      setAuthenticated(false);
      navigate('/');
    }
  }, [setAuthenticated, navigate, location]);

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