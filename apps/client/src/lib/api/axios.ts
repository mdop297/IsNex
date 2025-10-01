import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 5000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Authenticated API
export const secureApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 5000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

secureApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
