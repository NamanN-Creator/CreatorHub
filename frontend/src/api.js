import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Every request automatically carries the logged-in user's token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns any failed request into a readable message so buttons never fail silently.
export const errMsg = (err) => {
  if (err.response) return err.response.data?.message || `Request failed (${err.response.status})`;
  return 'Cannot reach the server. Is the backend running on port 5000?';
};

export default api;
