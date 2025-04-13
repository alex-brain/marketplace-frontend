import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE
} from '../actions/productActions';

// Начальное состояние
const initialState = {
  items: [],
  loading: false,
  error: null
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Здесь можно добавить другие кейсы для дополнительных действий с продуктами
    // например ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT и т.д.

    default:
      return state;
  }
};

export default productReducer;