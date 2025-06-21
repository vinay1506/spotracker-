import axios from 'axios';

const API_BASE_URL = 'https://spostats-backend-production.up.railway.app';

// Create a single axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const spotifyService = {
  // Redirect to Spotify login
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  },

  // Redirect to Spotify logout
  logout: () => {
    window.location.href = `${API_BASE_URL}/auth/logout`;
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