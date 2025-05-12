// src/redux/reducers/adminReducer.js
import {
    ADMIN_LOGIN_REQUEST,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT,
    FETCH_DASHBOARD_REQUEST,
    FETCH_DASHBOARD_SUCCESS,
    FETCH_DASHBOARD_FAIL
  } from '../actions/adminActions';
  
  const initialState = {
    user: null,
    token: localStorage.getItem('adminToken'),
    isAuthenticated: localStorage.getItem('adminToken') ? true : false,
    loading: false,
    error: null,
    dashboardData: null
  };
  
  export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADMIN_LOGIN_REQUEST:
      case FETCH_DASHBOARD_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      
      case ADMIN_LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: {
            id: action.payload.userId,
            name: action.payload.name,
            role: action.payload.role
          },
          token: action.payload.token,
          error: null
        };
      
      case FETCH_DASHBOARD_SUCCESS:
        return {
          ...state,
          loading: false,
          dashboardData: action.payload,
          error: null
        };
      
      case ADMIN_LOGIN_FAIL:
      case FETCH_DASHBOARD_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      
      case ADMIN_LOGOUT:
        return {
          ...state,
          user: null,
          token: null,
          isAuthenticated: false,
          dashboardData: null
        };
      
      default:
        return state;
    }
  };