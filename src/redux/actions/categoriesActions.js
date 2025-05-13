import axios from "axios";
import * as categoriesAPI from '../../services/categoriesAPI';

// Action Types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';


export const CATEGORY_CREATE_REQUEST = 'CATEGORY_CREATE_REQUEST';
export const CATEGORY_CREATE_SUCCESS = 'CATEGORY_CREATE_SUCCESS';
export const CATEGORY_CREATE_FAIL = 'CATEGORY_CREATE_FAIL';


// Action Creators
export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });

    try {
      const response = await categoriesAPI.getCategories();
      dispatch({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: response.data.categories
      });
    } catch (error) {
      dispatch({
        type: FETCH_CATEGORIES_FAILURE,
        payload: error.response?.data?.message || error.message
      });
    }
  };
};

// Дополнительные экшены для работы с категориями
export const selectCategory = (categoryId) => ({
  type: 'SELECT_CATEGORY',
  payload: categoryId
});

export const clearCategorySelection = () => ({
  type: 'CLEAR_CATEGORY_SELECTION'
});

// Создание новой категории
export const createCategory = (categoryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });

    // Получение токена из состояния для авторизации
    const { auth: { user } } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user.token}`
      }
    };

    // Создание FormData для отправки изображения
    const formData = new FormData();
    formData.append('name', categoryData.name);

    if (categoryData.description) {
      formData.append('description', categoryData.description);
    }

    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const { data } = await categoriesAPI.createCategory(categoryData);

    dispatch({
      type: CATEGORY_CREATE_SUCCESS,
      payload: data
    });

    // Обновляем список категорий
    dispatch(fetchCategories());

    return Promise.resolve();
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;

    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload: message
    });

    return Promise.reject(new Error(message));
  }
};