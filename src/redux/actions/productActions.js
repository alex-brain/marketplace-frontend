import axios from 'axios';
import { 
  PRODUCT_LIST_REQUEST, 
  PRODUCT_LIST_SUCCESS, 
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET
} from '../constants/productConstants';

// Здесь должен быть правильный базовый URL вашего API
const API_BASE_URL = 'http://localhost:5000'; // Измените на ваш актуальный URL

// Получение всех продуктов
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    // Добавляем базовый URL к запросу
    const { data } = await axios.get(`${API_BASE_URL}/api/products`);
    console.log('Данные от API:', data); // Добавьте это

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Получение деталей продукта
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    // Добавляем базовый URL к запросу
    const { data } = await axios.get(`${API_BASE_URL}/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Создание нового продукта
export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    /*const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    
    console.log('product', product)

    // Добавляем базовый URL к запросу
    const { data } = await axios.post(`${API_BASE_URL}/api/products`, product);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log('error', error)
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Сброс состояния создания продукта
export const resetProductCreate = () => (dispatch) => {
  dispatch({ type: PRODUCT_CREATE_RESET });
};

// Загрузка изображения продукта
export const uploadProductImage = (formData) => async (dispatch, getState) => {
  try {
    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Добавляем базовый URL к запросу
    const { data } = await axios.post(`${API_BASE_URL}/api/upload`, formData, config);

    return data; // Возвращаем путь к изображению
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Получение списка категорий для формы создания продукта
export const listCategories = () => async (dispatch) => {
  try {
    // Добавляем базовый URL к запросу
    const { data } = await axios.get(`${API_BASE_URL}/api/categories`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};