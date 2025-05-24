import axios from 'axios';
import { 
  GET_PROFILE_REQUEST, 
  GET_PROFILE_SUCCESS, 
  GET_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL
} from '../constants/userConstants';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Получение профиля пользователя
export const getUserProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PROFILE_REQUEST });

    const { auth: { token } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const { data } = await axios.get('/api/auth/me', config);
    
    console.log('data', data)

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message
    });
  }
};

// Обновление профиля пользователя
export const updateUserProfile = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const {auth: {token, user}} = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const {data} = await axios.put(
      `${API_URL}/auth/update`,
      {
        ...userData,
        id: user.id
      },
      config);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message
    });
  }
};