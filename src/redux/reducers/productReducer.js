import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE
} from '../actions/productActions';

// Начальное состояние
const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };

    case 'FETCH_PRODUCTS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SELECT_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload,
      };

    case 'CLEAR_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: null,
      };

    // Здесь можно добавить другие кейсы для дополнительных действий с продуктами
    // например ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT и т.д.

    default:
      return state;
  }
};

export default productReducer;