import axios from 'axios';

// Create axios instance
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { token: newToken } = response.data.data;
          localStorage.setItem('token', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        
        // Redirect to login page or dispatch logout action
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Import all API modules
import authAPI from './authAPI';
import productAPI from './productAPI';
import cartAPI from './cartAPI';
import wishlistAPI from './wishlistAPI';
import orderAPI from './orderAPI';
import categoryAPI from './categoryAPI';
import corporateAPI from './corporateAPI';
import adminAPI from './adminAPI';
import userAPI from './userAPI';

// Export individual APIs
export {
  authAPI,
  productAPI,
  cartAPI,
  wishlistAPI,
  orderAPI,
  categoryAPI,
  corporateAPI,
  adminAPI,
  userAPI
};

export default api;