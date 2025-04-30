import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
