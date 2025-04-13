import axios from 'axios';
import { getToken } from './storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовым URL
const categoriesAPI = axios.create({
  baseURL: `${API_URL}/categories/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = () => {
  return axios.get(`${API_URL}/categories`);
};