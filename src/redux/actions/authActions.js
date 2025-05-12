import axios from 'axios';
import * as authAPI from '../../services/authApi';
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT
} from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Проверка аутентификации пользователя при загрузке приложения
export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');

  if (!token) {
    dispatch({ type: AUTH_FAILURE });
    return;
  }

  dispatch({ type: AUTH_REQUEST });

  try {
    const response = await authAPI.getCurrentUser();

    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token,
        user: response.data.user
      }
    });
  } catch (error) {
    dispatch({
      type: AUTH_FAILURE,
      payload: error.response?.data?.message || 'Ошибка авторизации'
    });
  }
};

// Регистрация нового пользователя
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REQUEST });

    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    dispatch({
      type: AUTH_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_FAILURE,
      payload: error.response?.data?.message || 'Ошибка регистрации'
    });
    throw error;
  }
};

// Авторизация пользователя
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REQUEST });

    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    dispatch({
      type: AUTH_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_FAILURE,
      payload: error.response?.data?.message || 'Неверные email или пароль'
    });
    throw error;
  }
};

// Выход пользователя
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    dispatch({ type: AUTH_FAILURE });
    return;
  }

  try {
    dispatch({ type: AUTH_REQUEST });

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: AUTH_SUCCESS,
      payload: { token, user: response.data },
    });
  } catch (error) {
    dispatch({
      type: AUTH_FAILURE,
      payload: error.response?.data?.message || 'Failed to load user',
    });
  }
};

export const updateBonusPoints = (points) => ({
  type: 'UPDATE_BONUS_POINTS',
  payload: points,
});