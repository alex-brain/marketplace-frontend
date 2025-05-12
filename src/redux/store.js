import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Импорт редьюсеров
import authReducer from './reducers/authReducer';
import productReducer from './reducers/productReducer';
import categoryReducer from './reducers/categoriesReducer';
import cartReducer from './reducers/cartReducer';
// import orderReducer from './reducers/orderReducer';

// Объединение редьюсеров
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  categories: categoryReducer,
  cart: cartReducer,
  // orders: orderReducer
});

// Создание store с middleware
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;