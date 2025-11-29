import { apiService } from './apiService';

export const getBusinessData = async () => {
  const response = await apiService.get('/business');
  return response.data;
};

export const updateBotConfiguration = async (config: any) => {
  const response = await apiService.put('/business/bot-config', config);
  return response.data;
};
