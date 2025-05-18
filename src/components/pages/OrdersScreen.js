import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/actions/orderActions';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import './OrdersScreen.css';

const OrdersScreen = () => {
  const dispatch = useDispatch();
  //const [selectedOrder, setSelectedOrder] = useState(null);
  const { loading, error, orders } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const viewOrderDetails = (order) => {
  //  setSelectedOrder(order);
  };

  return (
    <div className="orders-container">
      <h2>Мои заказы</h2>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <>
          {orders.length === 0 ? (
            <Message>У вас пока нет заказов</Message>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ДАТА</th>
                    <th>СУММА</th>
                    <th>ОПЛАЧЕН</th>
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
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        <Link to={`/order/:id${order.id}`} className="btn btn-details">
                          Детали
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersScreen;