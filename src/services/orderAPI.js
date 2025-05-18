import axios from 'axios';
import { getToken } from './storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовым URL
const orderAPI = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов для добавления токена авторизации
orderAPI.interceptors.request.use(
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
 * Получение списка заказов пользователя
 * (для покупателя - свои заказы, для продавца - все заказы)
 */
export const getOrders = async () => {
  try {
    const response = await orderAPI.get('/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch orders');
  }
};

/**
 * Получение заказа по ID
 *
 * @param {string} id - ID заказа
 */
export const getOrderById = async (id) => {
  try {
    const response = await orderAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch order');
  }
};

/**
 * Создание нового заказа
 *
 * @param {Object} orderData - Данные заказа
 * @param {string} orderData.shippingAddress - Адрес доставки
 * @param {string} orderData.paymentMethod - Способ оплаты
 */
export const createOrder = async (orderData) => {
  try {
    const response = await orderAPI.post('/', orderData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create order');
  }
};

/**
 * Обновление статуса заказа (только для продавца)
 *
 * @param {string} id - ID заказа
 * @param {string} status - Новый статус заказа (pending, processing, shipped, delivered, cancelled)
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await orderAPI.put(`/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update order status');
  }
};

/**
 * Отмена заказа
 *
 * @param {string} id - ID заказа
 */
export const cancelOrder = async (id) => {
  try {
    const response = await orderAPI.put(`/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to cancel order');
  }
};

/**
 * Получение количества заказов по статусам (для продавца/админа)
 */
export const getOrdersCount = async () => {
  try {
    const response = await orderAPI.get('/count');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch orders count');
  }
};

/**
 * Получение статистики продаж (для продавца/админа)
 *
 * @param {Object} params - Параметры запроса
 * @param {string} params.startDate - Начальная дата (YYYY-MM-DD)
 * @param {string} params.endDate - Конечная дата (YYYY-MM-DD)
 */
export const getSalesStats = async (params = {}) => {
  try {
    const response = await orderAPI.get('/stats', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch sales statistics');
  }
};

/**
 * Получение заказов по статусу
 *
 * @param {string} status - Статус заказа (pending, processing, shipped, delivered, cancelled)
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {number} params.limit - Количество заказов на странице
 */
export const getOrdersByStatus = async (status, params = {}) => {
  try {
    const queryParams = { ...params, status };
    const response = await orderAPI.get('/', { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch orders by status');
  }
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrdersCount,
  getSalesStats,
  getOrdersByStatus
};