import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchOrders, updateOrderStatus} from '../../redux/actions/orderActions';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  //console.log('orders', orders)

  useEffect(() => {
   dispatch(fetchOrders());
  }, [dispatch]);

   const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus(orderId, newStatus));
   };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  //console.log('filteredOrders', filteredOrders)

  return (
    <div className="order-management">
      <h2>Управление заказами</h2>

      <div className="filter-controls">
        <label>Фильтр по статусу:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Все заказы</option>
          <option value="processing">В обработке</option>
          <option value="awaiting">Ожидает оплаты</option>
          <option value="paid">Оплачен</option>
          <option value="shipped">Отправлен</option>
          <option value="delivered">Доставлен</option>
          <option value="cancelled">Отменен</option>
          <option value="end">Завершен</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Дата</th>
          <th>Покупатель</th>
          <th>Сумма</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        {filteredOrders.length === 0 ? (
          <tr>
            <td colSpan="6">Заказы не найдены</td>
          </tr>
        ) : (
          filteredOrders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>{order.user_name}</td>
              <td>₽{parseFloat(order.total_amount).toFixed(2)}</td>
              <td>
                <select
                  value={order.status}
                   onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="processing">В обработке</option>
                  <option value="awaiting">Ожидает оплаты</option>
                  <option value="paid">Оплачен</option>
                  <option value="shipped">Отправлен</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменен</option>
                  <option value="end">Завершен</option>
                </select>
              </td>
              <td>
                <button onClick={() => viewOrderDetails(order)}>
                  Подробнее
                </button>
              </td>
            </tr>
          ))
        )}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <span className="close" onClick={closeOrderDetails}>&times;</span>
            <h3>Заказ #{selectedOrder.id}</h3>

            <div className="order-info">
              <p><strong>Дата:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><strong>Покупатель:</strong> {selectedOrder.user_name}</p>
              <p><strong>Email:</strong> {selectedOrder.user_email}</p>
              <p><strong>Статус:</strong> {selectedOrder.status}</p>
              <p><strong>Адрес доставки:</strong> {selectedOrder.shipping_address}</p>
            </div>

            <h4>Товары в заказе</h4>
            <table className="order-items-table">
              <thead>
              <tr>
                <th>Товар</th>
                <th>Цена</th>
                <th>Кол-во</th>
                <th>Сумма</th>
              </tr>
              </thead>
              <tbody>
              {selectedOrder.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>₽{parseFloat(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₽{(parseFloat(item.price) * item.quantity).toFixed(2)}</td></tr>
              ))}
              </tbody>
              <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right' }}>
                  <strong>Итого:</strong>
                </td>
                <td>₽{parseFloat(selectedOrder.total_amount).toFixed(2)}</td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;