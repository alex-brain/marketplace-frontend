import React from 'react';
// import { Helmet } from 'react-helmet';
import LoginForm from '../user/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      {/*<Helmet>
        <title>Sign In | Marketplace</title>
        <meta name="description" content="Sign in to your account to access your profile, orders, and wishlist." />
      </Helmet>*/}

      <div className="login-page-container">
        <div className="login-page-content">
          <div className="login-form-section">
            <LoginForm />
          </div>

          <div className="login-image-section">
            <div className="login-image-wrapper">
              <img
                src="/assets/images/login-illustration.svg"
                alt="Login"
                className="login-illustration"
              />
              <div className="login-benefits">
                <h3>Преимущества личного аккаунта</h3>
                <ul>
                  <li>Отслеживайте историю заказов</li>
                  <li>Сохраняйте товары в корзине</li>
                  <li>Получайте личные бонусы и рекомендации</li>
                  <li>Совершайте покупки всего в пару кликов</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;