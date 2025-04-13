import axios from 'axios';
import { getToken } from './storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем экземпляр axios с базовым URL
const productsAPI = axios.create({
  baseURL: `${API_URL}/products`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов для добавления токена авторизации
productsAPI.interceptors.request.use(
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
 * Получение списка товаров с возможностью фильтрации, сортировки и пагинации
 *
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {number} params.limit - Количество товаров на странице
 * @param {string} params.sort - Поле для сортировки (name, price, createdAt)
 * @param {string} params.order - Направление сортировки (asc, desc)
 * @param {string} params.category - ID категории для фильтрации
 * @param {string} params.search - Поисковый запрос
 * @param {number} params.minPrice - Минимальная цена для фильтрации
 * @param {number} params.maxPrice - Максимальная цена для фильтрации
 * @param {boolean} params.inStock - Фильтр наличия товара
 * @param {boolean} params.featured - Показывать только рекомендуемые товары
 * @param {boolean} params.discount - Показывать только товары со скидкой
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await productsAPI.get('/', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch products');
  }
};

/**
 * Получение товара по ID
 *
 * @param {string} id - ID товара
 */
export const getProductById = async (id) => {
  try {
    const response = await productsAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch product');
  }
};

/**
 * Получение связанных товаров
 *
 * @param {string} id - ID товара
 * @param {number} limit - Максимальное количество товаров
 */
export const getRelatedProducts = async (id, limit = 4) => {
  try {
    const response = await productsAPI.get(`/${id}/related`, { params: { limit } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch related products');
  }
};

/**
 * Создание нового товара (только для админа)
 *
 * @param {Object} productData - Данные товара
 */
export const createProduct = async (productData) => {
  try {
    const response = await productsAPI.post('/', productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create product');
  }
};

/**
 * Обновление товара (только для админа)
 *
 * @param {string} id - ID товара
 * @param {Object} productData - Данные товара
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await productsAPI.put(`/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update product');
  }
};

/**
 * Удаление товара (только для админа)
 *
 * @param {string} id - ID товара
 */
export const deleteProduct = async (id) => {
  try {
    const response = await productsAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete product');
  }
};

/**
 * Добавление отзыва к товару
 *
 * @param {string} productId - ID товара
 * @param {Object} reviewData - Данные отзыва
 * @param {number} reviewData.rating - Оценка (1-5)
 * @param {string} reviewData.comment - Текст отзыва
 */
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await productsAPI.post(`/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add review');
  }
};

/**
 * Получение отзывов о товаре
 *
 * @param {string} productId - ID товара
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {number} params.limit - Количество отзывов на странице
 * @param {string} params.sort - Поле для сортировки (createdAt, rating)
 * @param {string} params.order - Направление сортировки (asc, desc)
 */
export const getProductReviews = async (productId, params = {}) => {
  try {
    const response = await productsAPI.get(`/${productId}/reviews`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch reviews');
  }
};

/**
 * Получение категорий товаров
 */
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch categories');
  }
};

/**
 * Получение категории по ID
 *
 * @param {string} id - ID категории
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch category');
  }
};

/**
 * Получение товаров из указанной категории
 *
 * @param {string} categoryId - ID категории
 * @param {Object} params - Параметры запроса (те же, что и для getProducts)
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/products`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch products by category');
  }
};

/**
 * Добавление товара в избранное
 *
 * @param {string} productId - ID товара
 */
export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(`${API_URL}/wishlist`, { productId }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add to wishlist');
  }
};

/**
 * Удаление товара из избранного
 *
 * @param {string} productId - ID товара
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to remove from wishlist');
  }
};

/**
 * Получение списка избранных товаров
 */
export const getWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch wishlist');
  }
};

/**
 * Проверка наличия товара на складе
 *
 * @param {string} productId - ID товара
 * @param {number} quantity - Запрашиваемое количество
 */
export const checkProductAvailability = async (productId, quantity = 1) => {
  try {
    const response = await productsAPI.get(`/${productId}/availability`, {
      params: { quantity }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to check product availability');
  }
};

export default {
  getProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  getCategories,
  getCategoryById,
  getProductsByCategory,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkProductAvailability
};