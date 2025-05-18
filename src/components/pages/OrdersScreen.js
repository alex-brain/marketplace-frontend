import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {cancelOrder, fetchOrders} from '../../redux/actions/orderActions';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import './OrdersScreen.css';

const STATUSES = {
  pending: 'Ожидает обработки',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
}

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { loading, error, orders } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const viewOrderDetails = (order) => {
    setSelectedOrder(selectedOrder && selectedOrder.id === order.id ? null : order);
  };

  const handleCancelOrder = (order) => {
    dispatch(cancelOrder(order.id));
  }

  return (
    <div className="orders-container">
      <h2>Мои заказы</h2>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <>
          {orders.length === 0 ? (
            <Message>У вас пока нет заказов</Message>
          ) : (
            <>
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>ДАТА</th>
                    <th>СУММА</th>
                    <th>СТАТУС</th>
                    <th>ДОСТАВЛЕН</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>{order.total_amount} ₽</td>
                      <td>
                        {STATUSES[order.status]}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="btn btn-details"
                        >
                          Детали
                        </button>

                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="btn btn-details"
                        >
                          Отменить
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {selectedOrder && (
                <div className="order-details">
                  <h3>Детали заказа #{selectedOrder.id}</h3>
                  <div className="order-info">
                    <p><strong>Дата:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    <p><strong>Статус:</strong> {selectedOrder.status}</p>
                    <p><strong>Сумма:</strong> {selectedOrder.total_amount} ₽</p>
                    <p><strong>Адрес доставки:</strong> {selectedOrder.shipping_address}</p>
                  </div>

                  <h4>Товары в заказе</h4>
                  <div className="order-items">
                    <table className="items-table">
                      <thead>
                      <tr>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Сумма</th>
                      </tr>
                      </thead>
                      <tbody>
                      {selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price} ₽</td>
                          <td>{(item.price * item.quantity).toFixed(2)} ₽</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersScreen;