import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAIL,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from '../actions/cartActions';

const initialState = {
  loading: false,
  items: [], // Массив товаров в корзине
  total: 0,  // Общая сумма
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Запрос на получение корзины
    case FETCH_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    // Успешное получение корзины
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        error: null
      };

    // Ошибка получения корзины
    case FETCH_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Запрос на добавление товара в корзину
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    // Успешное добавление товара в корзину
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        error: null
      };

    // Ошибка добавления товара в корзину
    case ADD_TO_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default cartReducer;