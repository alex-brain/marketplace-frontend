import * as authAPI from '../../services/authApi';
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT
} from './types';

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
  console.log('userData', userData)
  dispatch({ type: AUTH_REQUEST });

  try {
    const response = await authAPI.register(userData);
    console.log('response', response)

    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: response.token,
        user: response.user
      }
    });

    return true;
  } catch (error) {
    console.log('error', error)
    dispatch({
      type: AUTH_FAILURE,
      payload: error.response?.data?.message || 'Ошибка регистрации'
    });

    return false;
  }
};

// Авторизация пользователя
export const login = ({email, password}) => async (dispatch) => {
  dispatch({ type: AUTH_REQUEST });

  try {
    const response = await authAPI.login({email, password});

    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: response.data.token,
        user: response.data.user
      }
    });

    return true;
  } catch (error) {
    dispatch({
      type: AUTH_FAILURE,
      payload: error.response?.data?.message || 'Неверные email или пароль'
    });

    return false;
  }
};

// Выход пользователя
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};