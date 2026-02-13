import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ROUTES } from '@/shared/constants/routes';
import { clearAccessToken, getAccessToken } from '@/shared/services/auth/token-storage';

export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_API_URL,
  timeout: 5000,
});

export const walletApi = axios.create({
  baseURL: import.meta.env.VITE_WALLET_API_URL,
  timeout: 5000,
});

function applyAuth(config: InternalAxiosRequestConfig) {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

function handleUnauthorized(error: AxiosError) {
  if (error.response?.status === 401) {
    clearAccessToken();

    if (window.location.pathname !== ROUTES.LOGIN) {
      window.location.assign(ROUTES.LOGIN);
    }
  }

  return Promise.reject(error);
}

usersApi.interceptors.request.use(applyAuth);
walletApi.interceptors.request.use(applyAuth);
usersApi.interceptors.response.use((response) => response, handleUnauthorized);
walletApi.interceptors.response.use((response) => response, handleUnauthorized);
