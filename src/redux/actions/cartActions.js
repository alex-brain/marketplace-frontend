import axios from 'axios';
import { toast } from 'react-toastify';
import cartAPI from '../../services/CartAPI';

// Действия для корзины
export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAIL = 'ADD_TO_CART_FAIL';

export const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_FAIL = 'FETCH_CART_FAIL';

// Добавление товара в корзину
export const addToCart = (productId, quantity = 1) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Необходима авторизация');
    }

    const response = await axios.post(
      'http://localhost:5000/api/cart/add',
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: response.data,
    });

    toast.success('Товар добавлен в корзину');
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
    toast.error(error.response?.data?.message || 'Не удалось добавить товар в корзину');
  }
};

export const fetchCart = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });

    // Здесь предполагается создание или существование cartAPI
    // Функция getCart() должна возвращать данные корзины в формате:
    // { items: [...], total: number }
    const data = await cartAPI.getCart();

    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: FETCH_CART_FAIL,
      payload: error.message || 'Произошла ошибка при загрузке корзины'
    });

    toast.error(error.message || 'Не удалось загрузить корзину');
  }
};