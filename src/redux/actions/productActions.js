import * as productsAPI from '../../services/productsAPI';
// import {getProducts} from "../../services/productsAPI";

// Action Types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Action Creators
export const fetchProducts = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    try {
      const response = await productsAPI.getProducts(filters);
      
      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: response.products
      });
    } catch (error) {
      dispatch({
        type: FETCH_PRODUCTS_FAILURE,
        payload: error.response?.data?.message || error.message
      });
    }
  };
};

// Аналогично для других действий с товарами