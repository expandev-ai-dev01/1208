/**
 * @singleton apiClient
 * @summary Axios client for REST API communication
 * @type rest-client
 * @category core-library
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
      }

      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors || [],
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
      });
    } else {
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);
