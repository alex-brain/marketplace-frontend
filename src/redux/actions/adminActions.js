// src/redux/actions/adminActions.js
import axios from 'axios';
import { setAuthToken } from '../../utils/setAuthToken';

// Типы действий
export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_FAIL = 'ADMIN_LOGIN_FAIL';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';
export const FETCH_DASHBOARD_REQUEST = 'FETCH_DASHBOARD_REQUEST';
export const FETCH_DASHBOARD_SUCCESS = 'FETCH_DASHBOARD_SUCCESS';
export const FETCH_DASHBOARD_FAIL = 'FETCH_DASHBOARD_FAIL';

// Вход для администратора
export const adminLogin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post('http://localhost:5000/api/admin/login', 
      { email, password }, 
      config
    );

    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: data
    });

    localStorage.setItem('adminToken', data.token);
    setAuthToken(data.token);
    
    return Promise.resolve();
  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message
    });
    
    return Promise.reject();
  }
};

// Выход администратора
export const adminLogout = () => (dispatch) => {
  localStorage.removeItem('adminToken');
  setAuthToken(null);
  dispatch({ type: ADMIN_LOGOUT });
};

// Загрузка данных для дашборда
export const fetchDashboardData = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_DASHBOARD_REQUEST });

    const { data } = await axios.get('http://localhost:5000/api/admin/dashboard');

    dispatch({
      type: FETCH_DASHBOARD_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: FETCH_DASHBOARD_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message
    });
  }
};