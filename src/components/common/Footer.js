import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>UnicornTactics</h3>
            <p>
              Ваш надежный интернет-магазин для покупки качественных товаров
              по лучшим ценам.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Информация</h3>
            <ul>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/shipping">Доставка</Link></li>
              <li><Link to="/payment">Оплата</Link></li>
              <li><Link to="/return-policy">Возврат</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Аккаунт</h3>
            <ul>
              <li><Link to="/login">Войти</Link></li>
              <li><Link to="/register">Регистрация</Link></li>
              <li><Link to="/profile">Мой профиль</Link></li>
              <li><Link to="/orders">Мои заказы</Link></li>
              
            </ul>
          </div>

          <div className="footer-column">
            <h3>Контакты</h3>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span> ул. Зиповская, 5В Литер Ц, г.Краснодар</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span> +7 (908) 693-69-38</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span> info@marketplace.com</span>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span> ВТ-ВС: 13:30 - 20:30</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} UnicornTactics. Все права защищены.</p>
          </div>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-apple-pay"></i>
          </div>
          <div className="footer-links">
            <Link to="/terms">Условия использования</Link>
            <span>|</span>
            <Link to="/privacy">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;