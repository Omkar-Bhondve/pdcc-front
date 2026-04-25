export const DEV_BACKEND_ORIGIN = 'http://localhost:5000';
export const API_PROXY_TARGET = DEV_BACKEND_ORIGIN;
export const API_BASE_PATH = '/api';

export const PUBLIC_FILE_BASE_URL = (typeof window !== 'undefined' && import.meta.env.DEV)
  ? DEV_BACKEND_ORIGIN
  : '';
