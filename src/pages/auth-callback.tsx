import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to decode base64-encoded JSON
function decodeToken(token: string) {
  try {
    const json = atob(token);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      const data = decodeToken(token);
      if (data) {
        // Store in localStorage (or sessionStorage as needed)
        localStorage.setItem('spostats_user', JSON.stringify(data));
        // Optionally store access token separately
        if (data.access_token) {
          localStorage.setItem('spostats_access_token', data.access_token);
        }
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
        return;
      }
    }
    // If token is missing or invalid, redirect to home
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing login...</h1>
        <p className="text-lg">Please wait while we log you in with Spotify.</p>
      </div>
    </div>
  );
};

export default AuthCallback; 