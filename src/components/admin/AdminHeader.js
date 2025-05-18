// src/components/admin/AdminHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminHeader = () => {
  const { user } = useSelector(state => state.admin);

  return (
    <header className="admin-header">
      <div className="header-title">
        <h1>Панель управления</h1>
      </div>
      <div className="header-actions">
        <Link to="/" className="view-store" target="_blank">
          <i className="fas fa-external-link-alt"></i> Перейти в магазин
        </Link>
        <div className="admin-profile-mini">
          <span>{user ? user.name : 'Администратор' || 'seller'}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;