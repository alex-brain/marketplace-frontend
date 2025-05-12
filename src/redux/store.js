import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Импортируйте ваши редьюсеры
import categoryReducer from './reducers/categoriesReducer';
import authReducer from './reducers/authReducer';
import { cartReducer } from './reducers/cartReducer'; 
import { adminReducer } from './reducers/adminReducer';
import { orderReducer } from './reducers/orderReducer';

import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
} from './reducers/productReducer';
// Импортируйте другие редьюсеры по необходимости

// Объедините все редьюсеры
const reducer = combineReducers({
  categories: categoryReducer,
  auth: authReducer,
  products: productListReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  cart:cartReducer,
  admin: adminReducer,
  orders: orderReducer

  // Добавьте другие редьюсеры по необходимости
});
const initialState = {};

const middleware = [thunk];
// Создайте хранилище с middleware и DevTools
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;