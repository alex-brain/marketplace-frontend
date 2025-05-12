import axios from 'axios';
import { toast } from 'react-toastify';

// Действия для корзины
export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAIL = 'ADD_TO_CART_FAIL';

// Добавление товара в корзину
export const addToCart = (productId, quantity = 1) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Необходима авторизация');
    }

    const response = await axios.post(
      'http://localhost:5000/api/cart',
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