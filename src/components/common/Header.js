import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import { fetchCategories } from '../../redux/actions/categoriesActions';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const  categories = useSelector(state => state.categories?.items || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
   const [showContactsMenu, setShowContactsMenu] = useState(false);
  console.log('Categories from Redux:', categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  
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

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>UniTac</h1>
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
                <Link to="/" className="nav-link">+7-908-693-69-38</Link>
              </li>
              <li
                className="categories-dropdown"
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)} // Изменено на onClick
              >
                <span className="nav-link">
                  Категории <i className="fas fa-chevron-down"></i>
                </span>
                {categories && categories.length > 0 && (
                  <div className={`dropdown-menu ${showCategoriesMenu ? 'show' : ''}`}>
                    {categories.map(category => (
                      <Link
                        key={category.id}
                        to={`/categories/${category.id}`}
                        className="dropdown-item"
                        onClick={() => {
                          setShowMobileMenu(false);
                          setShowCategoriesMenu(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              <li>
                <Link to="/products" className="nav-link">Все товары</Link>
              </li>
              <li>
                <Link to="/about" className="nav-link">О нас</Link>
              </li>
              <li
                className="contacts-dropdown"
            onMouseEnter={() => setShowContactsMenu(true)}
            onMouseLeave={() => setShowContactsMenu(false)}
          >
            <span className="nav-link">
              Контакты <i className="fas fa-chevron-down"></i>
            </span>
            <div className={`dropdown-menu contacts-menu ${showContactsMenu ? 'show' : ''}`}>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+7 (908) 693-69-38</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>г. Краснодар, ул. Зиповская, д.5В литер Ц</span>
              </div>
              <div className="contact-socials">
                <a 
                  href="https://wa.me/79086936938" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link whatsapp"
                  title="Написать в WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a 
                  href="https://vk.com/unicorntactics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link vk"
                  title="Мы ВКонтакте"
                >
                  <i className="fab fa-vk"></i>
                </a>
              </div>
            </div>
          
              </li>
            </ul>
          </nav>
        </div>

        <div className={`header-right ${showMobileMenu ? 'show' : ''}`}>
          <div className="header-actions">
            <Link to="/cart" className="cart-icon" onClick={() => setShowMobileMenu(false)}>
              <i className="fas fa-shopping-cart"></i>
            </Link>

            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <i className="fas fa-user"></i>
                  <span>{user?.name}</span>
                </button>
                <div className={`dropdown-menu ${showUserMenu ? 'show' : ''}`}>
                  <Link to="/profile" onClick={() => { setShowUserMenu(false); setShowMobileMenu(false); }}>
                    Мой профиль
                  </Link>
                  <Link to="/orders" onClick={() => { setShowUserMenu(false); setShowMobileMenu(false); }}>
                    Мои заказы
                  </Link>
                  {user?.role === 'seller' && (
                    <Link to="/admin/dashboard" onClick={() => { setShowUserMenu(false); setShowMobileMenu(false); }}>
                      Панель управления
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setShowUserMenu(false); }}>Выйти</button>
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