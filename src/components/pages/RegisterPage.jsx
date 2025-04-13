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
                <h3>Why Create an Account?</h3>
                <ul>
                  <li>Fast and secure checkout</li>
                  <li>Store multiple shipping addresses</li>
                  <li>Access your order history</li>
                  <li>Track your packages</li>
                  <li>Save items to your wishlist</li>
                  <li>Receive exclusive offers and discounts</li>
                  <li>Earn bonus points with purchases</li>
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