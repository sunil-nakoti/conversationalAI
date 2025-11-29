import { apiService } from './apiService';

export const login = async (credentials: any) => {
  const response = await apiService.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (userData: any) => {
  const response = await apiService.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  const response = await apiService.get('/auth/me');
  return response.data;
};
