import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/actions/authActions';
import './Navigation.css';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Marketplace</Link>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Products</Link>
        
        <Link to="/cart" className="nav-link cart-link">
          Cart
          {items.length > 0 && (
            <span className="cart-badge">{items.length}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">
              {user.name}
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 