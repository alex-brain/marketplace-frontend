import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
// import { fetchCart } from '../../redux/actions/cartActions';
// import { fetchCategories } from '../../redux/actions/categoryActions';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  // const { items } = useSelector(state => state.cart);
  // const { categories } = useSelector(state => state.categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);

/*  useEffect(() => {
    dispatch(fetchCategories());
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);*/

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>Маркетплейс</h1>
          </Link>
          <button
            className="mobile-menu-button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <div className={`header-center ${showMobileMenu ? 'show' : ''}`}>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>

          <nav className="nav-menu">
            <ul>
              <li className="nav-item">
                <Link to="/" className="nav-link">Главная</Link>
              </li>
              <li
                className="categories-dropdown"
                onMouseEnter={() => setShowCategoriesMenu(true)}
                onMouseLeave={() => setShowCategoriesMenu(false)}
              >
                <span>Категории</span>
               {/* {categories.length > 0 && (
                  <div className={`dropdown-menu ${showCategoriesMenu ? 'show' : ''}`}>
                    {categories.map(category => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}*/}
              </li>
              <li>
                <Link to="/products" className="nav-link">Все товары</Link>
              </li>
              <li>
                <Link to="/about" className="nav-link">О нас</Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link">Контакты</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={`header-right ${showMobileMenu ? 'show' : ''}`}>
          <div className="header-actions">
            <Link to="/cart" className="cart-icon" onClick={() => setShowMobileMenu(false)}>
              <i className="fas fa-shopping-cart"></i>
              {/*{cartItemsCount > 0 && (
                <span className="cart-count">{cartItemsCount}</span>
              )}*/}
            </Link>

            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="user-button">
                  <i className="fas fa-user"></i>
                  <span>{user.name}</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)}>
                    Мой профиль
                  </Link>
                  <Link to="/orders" onClick={() => setShowMobileMenu(false)}>
                    Мои заказы
                  </Link>
                  {user.role === 'seller' && (
                    <Link to="/admin" onClick={() => setShowMobileMenu(false)}>
                      Панель управления
                    </Link>
                  )}
                  <button onClick={handleLogout}>Выйти</button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="login-button"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="register-button"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;