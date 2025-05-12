import axios from 'axios';
import { getToken } from './storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовым URL
const cartAPI = axios.create({
  baseURL: `${API_URL}/cart`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов для добавления токена авторизации
cartAPI.interceptors.request.use(
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

/**
 * Получение содержимого корзины пользователя
 */
export const getCart = async () => {
  try {
    const response = await cartAPI.get('/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch cart');
  }
};

/**
 * Добавление товара в корзину
 *
 * @param {string} productId - ID товара
 * @param {number} quantity - Количество товара
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await cartAPI.post('/add', { productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add item to cart');
  }
};

/**
 * Обновление количества товара в корзине
 *
 * @param {string} itemId - ID элемента корзины
 * @param {number} quantity - Новое количество
 */
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await cartAPI.put(`/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update cart item');
  }
};

/**
 * Удаление товара из корзины
 *
 * @param {string} itemId - ID элемента корзины
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await cartAPI.delete(`/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to remove item from cart');
  }
};

/**
 * Очистка корзины
 */
export const clearCart = async () => {
  try {
    const response = await cartAPI.delete('/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to clear cart');
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};