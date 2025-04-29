import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Импортируйте ваши редьюсеры
import categoryReducer from './reducers/categoriesReducer';
import authReducer from './reducers/authReducer';
import productReducer from './reducers/productReducer';
// Импортируйте другие редьюсеры по необходимости

// Объедините все редьюсеры
const rootReducer = combineReducers({
  categories: categoryReducer,
  auth: authReducer,
  products: productReducer,
  // Добавьте другие редьюсеры по необходимости
});

// Создайте хранилище с middleware и DevTools
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;