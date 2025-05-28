import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import './About.css';

// Подкомпоненты для каждого раздела
const AboutUs = () => (
  <div className="about-content">
    <h2>О компании UniTac</h2>
    <p>Мы специализируемся на продаже тактического снаряжения...</p>
    {/* Добавьте контент */}
  </div>
);

const Payment = () => (
  <div className="about-content">
    <h2>Способы оплаты</h2>
    <ul>
      <li>Наличными при получении</li>
      <li>Банковской картой онлайн</li>
      <li>Перевод на расчетный счет</li>
    </ul>
  </div>
);

const Delivery = () => (
  <div className="about-content">
    <h2>Доставка</h2>
    <p>Мы осуществляем доставку по всей России...</p>
  </div>
);

const Returns = () => (
  <div className="about-content">
    <h2>Возврат и обмен</h2>
    <p>Условия возврата и обмена товара...</p>
  </div>
);

const About = () => {
  const [activeSection, setActiveSection] = useState('about-us');

  return (
    <div className="about-page">
      <div className="about-container">
        <aside className="about-sidebar">
          <h3>Информация</h3>
          <nav className="about-nav">
            <NavLink 
              to="/about/about-us" 
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              О нас
            </NavLink>
            <NavLink 
              to="/about/payment" 
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              Оплата
            </NavLink>
            <NavLink 
              to="/about/delivery" 
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              Доставка
            </NavLink>
            <NavLink 
              to="/about/returns" 
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              Возврат и обмен
            </NavLink>
          </nav>
        </aside>

        <main className="about-main">
          <Routes>
            <Route path="/" element={<Navigate to="/about/about-us" replace />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/returns" element={<Returns />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default About;