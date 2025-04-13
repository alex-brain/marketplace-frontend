import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE
} from '../actions/categoriesActions';

// Начальное состояние
const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null
      };

    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload
      };

    case 'CLEAR_CATEGORY_SELECTION':
      return {
        ...state,
        selectedCategory: null
      };

    // Здесь можно добавить другие кейсы для дополнительных действий с категориями

    default:
      return state;
  }
};

export default categoriesReducer;