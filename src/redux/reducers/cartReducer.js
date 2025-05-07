import {
    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,
  } from '../actions/cartActions';
  
  const initialState = {
    loading: false,
    cart: { items: [], total: 0 },
    error: null,
  };
  
  export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TO_CART_REQUEST:
        return { ...state, loading: true };
      case ADD_TO_CART_SUCCESS:
        return { 
          ...state, 
          loading: false, 
          cart: action.payload, 
          error: null 
        };
      case ADD_TO_CART_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };