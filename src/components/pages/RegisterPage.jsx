import React from 'react';
// import { Helmet } from 'react-helmet';
import RegisterForm from '../user/RegisterForm';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-page">
{/*      <Helmet>
        <title>Create Account | Marketplace</title>
        <meta name="description" content="Create a new account to start shopping, track orders, and manage your profile." />
      </Helmet>*/}

      <div className="register-page-container">
        <div className="register-page-content">
          <div className="register-form-section">
            <RegisterForm />
          </div>

          <div className="register-image-section">
            <div className="register-image-wrapper">
              <img
                src="/assets/images/register-illustration.svg"
                alt="Register"
                className="register-illustration"
              />
              <div className="register-benefits">
                <h3>Для чего нужен личный аккаунт?</h3>
                <ul>
                  <li>Быстрое оформление заказов</li>
                  <li>Хранение данных для доставки</li>
                  <li>История заказов</li>
                  <li>Получение эксклюзивных предложений</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;