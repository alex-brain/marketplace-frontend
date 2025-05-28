import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Импортируйте ваши редьюсеры
import categoriesReducer from './reducers/categoriesReducer';
import authReducer from './reducers/authReducer';
import { cartReducer } from './reducers/cartReducer'; 
import { adminReducer } from './reducers/adminReducer';
import { orderReducer } from './reducers/orderReducer';
import { userProfileReducer } from './reducers/userReducers';


import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer, productSearchReducer,productDeleteReducer
} from './reducers/productReducer';
// Импортируйте другие редьюсеры по необходимости

// Объедините все редьюсеры
const reducer = combineReducers({
  categories: categoriesReducer,
  auth: authReducer,
  products: productListReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productSearchReducer: productSearchReducer,
  productDelete: productDeleteReducer,
  cart:cartReducer,
  admin: adminReducer,
  orders: orderReducer,
  userProfile: userProfileReducer,
 

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