// src/components/admin/AdminSidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../redux/actions/adminActions';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.admin);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-profile">
        <div className="admin-info">
          <h3>{user ? user.name : 'Администратор'}</h3>
          <p>{user ? user.role : 'Загрузка...'}</p>
        </div>
      </div>

      <nav className="admin-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tachometer-alt"></i> Дашборд
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-box"></i> Товары
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-shopping-cart"></i> Заказы
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tags"></i> Категории
            </NavLink>
          </li>
          {user && user.role === 'admin' && (
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fas fa-users"></i> Пользователи
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-cog"></i> Настройки
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="admin-logout">
        <button onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Выйти
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;