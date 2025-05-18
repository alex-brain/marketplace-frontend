import axios from 'axios';
import { getToken } from './storage';

// Базовый URL для API (можно загрузить из .env)
const API_URL = process.env.REACT_APP_API_URL || '';

// Создаем instance axios с базовым URL
const api = axios.create({
  baseURL: API_URL
});

// Функция для добавления токена авторизации к запросам
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Получение профиля пользователя
export const getUserProfile = async () => {
  try {
    const { data } = await api.get('/api/users/profile');
    return data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (userData) => {
  try {
    const { data } = await api.put('/api/users/profile', userData);
    return data;
  } catch (error) {
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

// Выход из аккаунта (удаление токена)
export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('token'); // Если токен хранится в localStorage
  sessionStorage.removeItem('token'); // Если токен хранится в sessionStorage
  return { success: true };
};

export default api;