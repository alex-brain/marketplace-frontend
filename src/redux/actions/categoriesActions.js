import * as categoriesAPI from '../../services/categoriesAPI';

// Action Types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

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