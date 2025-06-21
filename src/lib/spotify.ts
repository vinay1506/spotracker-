import axios from 'axios';

const API_BASE_URL = 'https://spostats-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send cookies!
});

export const spotifyService = {
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  },
  logout: async () => {
    await api.post('/auth/logout');
    window.location.href = '/';
  },
  getProfile: async () => {
    const response = await api.get('/api/me');
    return response.data;
  },
  getTopTracks: async (timeRange = 'medium_term') => {
    const response = await api.get('/api/top-tracks', { params: { time_range: timeRange } });
    return response.data;
  },
  getTopArtists: async (timeRange = 'medium_term') => {
    const response = await api.get('/api/top-artists', { params: { time_range: timeRange } });
    return response.data;
  },
  getRecentlyPlayed: async () => {
    const response = await api.get('/api/recently-played');
    return response.data;
  },
  getAuthStatus: async () => {
    const response = await api.get('/auth/status');
    return response.data;
  },
  debugSession: async () => {
    const response = await api.get('/auth/debug-session');
    return response.data;
  },
};

// If you need fetch for some endpoints:
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    credentials: 'include',
  });
} 