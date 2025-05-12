import axios from 'axios';
import * as productsAPI from '../../services/productsAPI';
// import {getProducts} from "../../services/productsAPI";

// Action Types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Action Creators
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_PRODUCTS_START' });

    const response = await axios.get(`${API_URL}/products`);
    
    dispatch({
      type: 'FETCH_PRODUCTS_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_PRODUCTS_FAIL',
      payload: error.response?.data?.message || 'Failed to fetch products',
    });
  }
};

export const selectProduct = (product) => ({
  type: 'SELECT_PRODUCT',
  payload: product,
});

export const clearSelectedProduct = () => ({
  type: 'CLEAR_SELECTED_PRODUCT',
});

// Аналогично для других действий с товарами