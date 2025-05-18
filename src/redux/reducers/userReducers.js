import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL
} from '../constants/userConstants';

export const userProfileReducer = (state = { loading: false, profile: {} }, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true };
    case GET_PROFILE_SUCCESS:
      return { loading: false, profile: action.payload };
    case UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, profile: action.payload };
    case GET_PROFILE_FAIL:
    case UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};