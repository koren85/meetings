import axios from 'axios';
import { Protocol } from '../types';

const API_URL = '/api';

const logApiCall = (method: string, url: string, data?: any) => {
  console.log(`API Call: ${method} ${url}`);
  if (data) console.log('Data:', data);
};

const handleApiError = (error: any, fallbackValue: any) => {
  console.error('API Error:', error.response?.data || error.message || 'Unknown error');
  return fallbackValue;
};

export const getAllProtocols = async (): Promise<Protocol[]> => {
  logApiCall('GET', `${API_URL}/protocols`);
  try {
    const response = await axios.get(`${API_URL}/protocols`);
    console.log('Protocols received:', response.data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, []);
  }
};

export const addProtocol = async (protocol: Protocol): Promise<Protocol> => {
  logApiCall('POST', `${API_URL}/protocols`, protocol);
  try {
    const response = await axios.post(`${API_URL}/protocols`, protocol);
    console.log('Protocol added:', response.data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, protocol);
  }
};

export const updateProtocol = async (protocol: Protocol): Promise<Protocol> => {
  logApiCall('PUT', `${API_URL}/protocols/${protocol.id}`, protocol);
  try {
    const response = await axios.put(`${API_URL}/protocols/${protocol.id}`, protocol);
    console.log('Protocol updated:', response.data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, protocol);
  }
};

export const deleteProtocol = async (id: number): Promise<boolean> => {
  logApiCall('DELETE', `${API_URL}/protocols/${id}`);
  try {
    const response = await axios.delete(`${API_URL}/protocols/${id}`);
    console.log('Protocol deleted:', response.data);
    return true;
  } catch (error: any) {
    return handleApiError(error, false);
  }
};

export const getAllRegions = async (): Promise<string[]> => {
  logApiCall('GET', `${API_URL}/regions`);
  try {
    const response = await axios.get(`${API_URL}/regions`);
    console.log('Regions received:', response.data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, []);
  }
};

export const getAllExecutors = async (): Promise<string[]> => {
  logApiCall('GET', `${API_URL}/executors`);
  try {
    const response = await axios.get(`${API_URL}/executors`);
    console.log('Executors received:', response.data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, []);
  }
};