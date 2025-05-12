// src/components/admin/Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchDashboardData } from '../../redux/actions/adminActions';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    dashboardData, 
    loading, 
    error 
  } = useSelector(state => state.admin);

  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return <div>No data available</div>;

  // Проверяем наличие всех необходимых данных перед деструктурированием
  const productStats = dashboardData.productStats || {};
  const orderStats = dashboardData.orderStats || {};
  const userStats = dashboardData.userStats || {};
  const orderStatusStats = dashboardData.orderStatusStats || [];
  const recentOrders = dashboardData.recentOrders || [];
  const popularProducts = dashboardData.popularProducts || [];

  return (
    <div className="admin-dashboard">
      <h2>Панель администратора</h2>

      {/* Статистика в карточках */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Товары</h3>
          <div className="stat-value">{productStats.total_products || 0}</div>
          <div className="stat-label">Всего товаров</div>
          <div className="stat-details">
            <div>На складе: {productStats.total_stock || 0}</div>
            <div>Средняя цена: ${parseFloat(productStats.avg_price || 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Заказы</h3>
          <div className="stat-value">{orderStats.total_orders || 0}</div>
          <div className="stat-label">Всего заказов</div>
          <div className="stat-details">
            <div>Выручка: ${parseFloat(orderStats.total_revenue || 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Пользователи</h3>
          <div className="stat-value">{userStats.total_users || 0}</div>
          <div className="stat-label">Всего пользователей</div>
        </div>
      </div>

      {/* Статистика по статусам заказов */}
      <div className="order-status-stats">
        <h3>Статусы заказов</h3>
        <div className="status-bars">
          {orderStatusStats.map(status => (
            <div key={status.status} className="status-bar">
              <div className="status-label">{status.status}</div>
              <div className="status-count">{status.count}</div>
              <div className="progress-bar">
                <div 
                  className={`progress ${status.status}`} 
                  style={{ 
                    width: `${orderStats.total_orders ? (status.count / orderStats.total_orders) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Последние заказы */}
      <div className="recent-orders">
        <h3>Последние заказы</h3>
        {recentOrders.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Покупатель</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user_name || 'Н/Д'}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status ${order.status || 'unknown'}`}>
                        {order.status || 'Не указан'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.id}`}>Подробнее</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="view-all">
              <Link to="/admin/orders">Все заказы →</Link>
            </div>
          </>
        ) : (
          <p>Нет данных о заказах</p>
        )}
      </div>

      {/* Популярные товары */}
      <div className="popular-products">
        <h3>Популярные товары</h3>
        {popularProducts.length > 0 ? (
          <>
            <div className="product-cards">
              {popularProducts.map(product => (
                <div key={product.id} className="product-card">
                  <img 
                    src={product.image_url ? `http://localhost:5000${product.image_url}` : '/placeholder-image.jpg'} 
                    alt={product.name || 'Товар'} 
                    onError={e => {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="product-info">
                    <h4>{product.name || 'Без названия'}</h4>
                    <p>${parseFloat(product.price || 0).toFixed(2)}</p>
                    <p>Продано: {product.total_quantity || 0} шт.</p>
                    <Link to={`/admin/products/${product.id}`}>
                      Редактировать
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all">
              <Link to="/admin/products">Все товары →</Link>
            </div>
          </>
        ) : (
          <p>Нет данных о популярных товарах</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;