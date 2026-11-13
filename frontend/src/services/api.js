import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export const fetchFilters = async () => {
  const response = await apiClient.get('/filters');
  return response.data;
};

export const fetchResources = async (params = {}) => {
  // Filter out empty params
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  });
  const response = await apiClient.get('/resources', { params: cleanParams });
  return response.data;
};

export const fetchResourceById = async (id) => {
  const response = await apiClient.get(`/resources/${id}`);
  return response.data;
};

export const fetchClusters = async () => {
  const response = await apiClient.get('/clusters');
  return response.data;
};

export const fetchEvaluation = async () => {
  const response = await apiClient.get('/evaluation');
  return response.data;
};

export default apiClient;

