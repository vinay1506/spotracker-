import axios from 'axios';

const API_BASE_URL = 'https://spostats-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send cookies!
});

// Use an interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Use an interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired.
      // The AuthContext will handle the logout, but we can also force a reload
      // to clear all state and redirect to login.
      localStorage.removeItem('spotifyToken');
      window.location.href = '/'; // Redirect to home/login page
    }
    return Promise.reject(error);
  }
);

export const spotifyService = {
  // Redirect to Spotify login
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  },

  // The logout functionality is now handled by the AuthContext and this interceptor
  // We can keep this for explicit logout button clicks if needed, which will trigger the interceptor logic
  logout: () => {
    localStorage.removeItem('spotifyToken');
    window.location.href = '/';
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/me');
    return response.data;
  },

  // Get top tracks
  getTopTracks: async (timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') => {
    const response = await api.get('/api/top-tracks', {
      params: { time_range: timeRange },
    });
    return response.data;
  },

  // Get top artists
  getTopArtists: async (timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') => {
    const response = await api.get('/api/top-artists', {
      params: { time_range: timeRange },
    });
    return response.data;
  },

  // Get recently played
  getRecentlyPlayed: async () => {
    const response = await api.get('/api/recently-played');
    return response.data;
  },
}; 