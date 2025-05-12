import { toast } from 'react-toastify';
import orderAPI from '../../services/orderAPI';

// Типы действий
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAIL = 'CREATE_ORDER_FAIL';

export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAIL = 'FETCH_ORDERS_FAIL';

export const FETCH_ORDER_DETAILS_REQUEST = 'FETCH_ORDER_DETAILS_REQUEST';
export const FETCH_ORDER_DETAILS_SUCCESS = 'FETCH_ORDER_DETAILS_SUCCESS';
export const FETCH_ORDER_DETAILS_FAIL = 'FETCH_ORDER_DETAILS_FAIL';

export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAIL = 'CANCEL_ORDER_FAIL';

export const UPDATE_ORDER_STATUS_REQUEST = 'UPDATE_ORDER_STATUS_REQUEST';
export const UPDATE_ORDER_STATUS_SUCCESS = 'UPDATE_ORDER_STATUS_SUCCESS';
export const UPDATE_ORDER_STATUS_FAIL = 'UPDATE_ORDER_STATUS_FAIL';

export const FETCH_ORDERS_COUNT_REQUEST = 'FETCH_ORDERS_COUNT_REQUEST';
export const FETCH_ORDERS_COUNT_SUCCESS = 'FETCH_ORDERS_COUNT_SUCCESS';
export const FETCH_ORDERS_COUNT_FAIL = 'FETCH_ORDERS_COUNT_FAIL';

export const FETCH_SALES_STATS_REQUEST = 'FETCH_SALES_STATS_REQUEST';
export const FETCH_SALES_STATS_SUCCESS = 'FETCH_SALES_STATS_SUCCESS';
export const FETCH_SALES_STATS_FAIL = 'FETCH_SALES_STATS_FAIL';

// Создание нового заказа
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const data = await orderAPI.createOrder(orderData);

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data
    });

    toast.success('Заказ успешно оформлен');
    return true; // Возвращаем true для успешного редиректа в компоненте

  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.message || 'Произошла ошибка при создании заказа'
    });

    toast.error(error.message || 'Не удалось оформить заказ');
    return false;
  }
};

// Получение списка заказов пользователя
export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });

    const data = await orderAPI.getOrders();

    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: data.orders
    });
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_FAIL,
      payload: error.message || 'Произошла ошибка при загрузке заказов'
    });

    toast.error(error.message || 'Не удалось загрузить заказы');
  }
};

// Получение деталей конкретного заказа
export const fetchOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });

    const data = await orderAPI.getOrderById(orderId);

    dispatch({
      type: FETCH_ORDER_DETAILS_SUCCESS,
      payload: data.order
    });
  } catch (error) {
    dispatch({
      type: FETCH_ORDER_DETAILS_FAIL,
      payload: error.message || 'Произошла ошибка при загрузке деталей заказа'
    });

    toast.error(error.message || 'Не удалось загрузить детали заказа');
  }
};

// Отмена заказа
export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: CANCEL_ORDER_REQUEST });

    const data = await orderAPI.cancelOrder(orderId);

    dispatch({
      type: CANCEL_ORDER_SUCCESS,
      payload: orderId
    });

    toast.success('Заказ успешно отменен');
    return true;
  } catch (error) {
    dispatch({
      type: CANCEL_ORDER_FAIL,
      payload: error.message || 'Произошла ошибка при отмене заказа'
    });

    toast.error(error.message || 'Не удалось отменить заказ');
    return false;
  }
};

// Обновление статуса заказа (для продавца/админа)
export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

    const data = await orderAPI.updateOrderStatus(orderId, status);

    dispatch({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: { id: orderId, status }
    });

    toast.success('Статус заказа успешно обновлен');
    return true;
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_STATUS_FAIL,
      payload: error.message || 'Произошла ошибка при обновлении статуса заказа'
    });

    toast.error(error.message || 'Не удалось обновить статус заказа');
    return false;
  }
};

// Получение количества заказов по статусам (для админа/продавца)
export const fetchOrdersCount = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_COUNT_REQUEST });

    const data = await orderAPI.getOrdersCount();

    dispatch({
      type: FETCH_ORDERS_COUNT_SUCCESS,
      payload: data.counts
    });
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_COUNT_FAIL,
      payload: error.message || 'Произошла ошибка при загрузке статистики заказов'
    });
  }
};

// Получение статистики продаж (для админа/продавца)
export const fetchSalesStats = (params) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SALES_STATS_REQUEST });

    const data = await orderAPI.getSalesStats(params);

    dispatch({
      type: FETCH_SALES_STATS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: FETCH_SALES_STATS_FAIL,
      payload: error.message || 'Произошла ошибка при загрузке статистики продаж'
    });
  }
};

// Получение заказов по статусу
export const fetchOrdersByStatus = (status, params) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });

    const data = await orderAPI.getOrdersByStatus(status, params);

    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: data.orders
    });
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_FAIL,
      payload: error.message || 'Произошла ошибка при загрузке заказов'
    });

    toast.error(error.message || 'Не удалось загрузить заказы');
  }
};