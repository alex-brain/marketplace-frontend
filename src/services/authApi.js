import axios from 'axios';
import { setToken, getToken, removeToken, setUserData, removeUserData } from './storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовым URL
const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов для добавления токена авторизации
authAPI.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Регистрация нового пользователя
export const register = async (userData) => {
  console.log('userData 1', userData)
  try {
    const response = await authAPI.post('/register', userData);
    if (response.data.token) {
      setToken(response.data.token);
      setUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

// Авторизация пользователя
export const login = async (credentials) => {
  try {
    const response = await authAPI.post('/login', credentials);
    if (response.data.token) {
      setToken(response.data.token);
      setUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Выход из системы
export const logout = () => {
  removeToken();
  removeUserData();
  return { success: true };
};

// Восстановление пароля - отправка email
export const forgotPassword = async (email) => {
  try {
    const response = await authAPI.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password reset request failed');
  }
};

// Смена пароля
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await authAPI.post(`/reset-password/${resetToken}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password reset failed');
  }
};

// Получение данных текущего пользователя
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get('/me');
    setUserData(response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Если токен недействителен, очищаем хранилище
      removeToken();
      removeUserData();
    }
    throw error.response ? error.response.data : new Error('Failed to get user data');
  }
};

// Обновление данных пользователя
export const updateUserProfile = async (userData) => {
  try {
    const response = await authAPI.put('/profile', userData);
    setUserData(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update profile');
  }
};

// Обновление пароля
export const updatePassword = async (passwordData) => {
  try {
    const response = await authAPI.put('/password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update password');
  }
};

// Получение истории бонусных баллов
export const getBonusHistory = async () => {
  try {
    const response = await authAPI.get('/bonus-history');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get bonus history');
  }
};

// Верификация email после регистрации
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await authAPI.get(`/verify-email/${verificationToken}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Email verification failed');
  }
};

// Google OAuth авторизация
export const googleAuth = async (token) => {
  try {
    const response = await authAPI.post('/google', { token });
    if (response.data.token) {
      setToken(response.data.token);
      setUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Google authentication failed');
  }
};

// Facebook OAuth авторизация
export const facebookAuth = async (token) => {
  try {
    const response = await authAPI.post('/facebook', { token });
    if (response.data.token) {
      setToken(response.data.token);
      setUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Facebook authentication failed');
  }
};

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateUserProfile,
  updatePassword,
  getBonusHistory,
  verifyEmail,
  googleAuth,
  facebookAuth
};