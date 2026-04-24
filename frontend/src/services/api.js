import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request interceptor: attach stored token ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/* ── Response interceptor: handle 401 ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

/* ── Auth ── */
export async function loginUser(email, password) {
  const { data } = await api.post('/api/v1/auth/login', { email, password });
  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await api.post('/api/v1/auth/register', { name, email, password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/api/v1/auth/me');
  return data;
}

/* ── Properties ── */
export async function getProperties(params = {}) {
  const { data } = await api.get('/api/v1/properties', { params });
  return data;
}

/* ── Watchlist ── */
export async function getWatchlist() {
  const { data } = await api.get('/api/v1/watchlist');
  return data;
}

export async function addToWatchlist(propertyId) {
  const { data } = await api.post('/api/v1/watchlist', { property_id: propertyId });
  return data;
}

export async function removeFromWatchlist(watchlistItemId) {
  await api.delete(`/api/v1/watchlist/${watchlistItemId}`);
}

export default api;
