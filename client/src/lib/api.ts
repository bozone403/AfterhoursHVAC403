// API utility functions for consistent API base URL handling

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afterhourshvac403.onrender.com';

export const getApiUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path; // Already a full URL
  }
  return `${API_BASE_URL}${path}`;
};

export const apiFetch = async (path: string, options?: RequestInit): Promise<Response> => {
  const url = getApiUrl(path);
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };
  
  return fetch(url, { ...defaultOptions, ...options });
};
