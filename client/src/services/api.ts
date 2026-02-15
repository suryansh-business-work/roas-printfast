import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('API Base URL:', config.apiBaseUrl);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
