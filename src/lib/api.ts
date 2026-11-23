// Cliente HTTP mínimo do front para o sinutre-back.
// Lê a base do servidor de import.meta.env.VITE_API_URL.
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

const TOKEN_KEY = 'sinutre.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export function getApiError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as {
      error?: string;
      fields?: Record<string, string>;
    };
    if (data?.error) {
      return { message: data.error, fields: data.fields ?? {} };
    }
    if (!err.response) {
      return {
        message: 'Não foi possível conectar ao servidor.',
        fields: {},
      };
    }
  }
  return { message: 'Erro inesperado. Tente novamente.', fields: {} };
}