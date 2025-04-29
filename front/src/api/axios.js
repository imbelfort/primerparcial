// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // si usas cookies (puede omitirse si sólo JWT)
});

// Interceptor para agregar token automáticamente
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');  // 👈 importante
  console.log('[AXIOS] Enviando token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
