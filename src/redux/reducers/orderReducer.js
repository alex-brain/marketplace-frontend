import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAIL,
  FETCH_ORDER_DETAILS_REQUEST,
  FETCH_ORDER_DETAILS_SUCCESS,
  FETCH_ORDER_DETAILS_FAIL,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAIL,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  FETCH_ORDERS_COUNT_REQUEST,
  FETCH_ORDERS_COUNT_SUCCESS,
  FETCH_ORDERS_COUNT_FAIL,
  FETCH_SALES_STATS_REQUEST,
  FETCH_SALES_STATS_SUCCESS,
  FETCH_SALES_STATS_FAIL
} from '../actions/orderActions';

const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  error: null,
  createError: null,
  updateError: null,
  success: false,
  counts: {
    all: 0,
    processing: 0,
    awaiting: 0,
    paid:0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    end:0
  },
  salesStats: {
    salesData: [],
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0
    }
  }
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Создание заказа
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
        success: false
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        createLoading: false,
        success: true,
        orders: [action.payload, ...state.orders],
        createError: null
      };
    case CREATE_ORDER_FAIL:
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
        success: false
      };

    // Получение списка заказов
    case FETCH_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: null
      };
    case FETCH_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Получение деталей заказа
    case FETCH_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        orderDetails: action.payload,
        error: null
      };
    case FETCH_ORDER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Отмена заказа
    case CANCEL_ORDER_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        orders: state.orders.map(order =>
          order.id === action.payload ? { ...order, status: 'cancelled' } : order
        ),
        orderDetails: state.orderDetails && state.orderDetails.id === action.payload ?
          { ...state.orderDetails, status: 'cancelled' } : state.orderDetails,
        updateError: null
      };
    case CANCEL_ORDER_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };

    // Обновление статуса заказа
    case UPDATE_ORDER_STATUS_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        ),
        orderDetails: state.orderDetails && state.orderDetails.id === action.payload.id ?
          { ...state.orderDetails, status: action.payload.status } : state.orderDetails,
        updateError: null
      };
    case UPDATE_ORDER_STATUS_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };

    // Получение количества заказов по статусам
    case FETCH_ORDERS_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ORDERS_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        counts: action.payload,
        error: null
      };
    case FETCH_ORDERS_COUNT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Получение статистики продаж
    case FETCH_SALES_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_SALES_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        salesStats: action.payload,
        error: null
      };
    case FETCH_SALES_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};