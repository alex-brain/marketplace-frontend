import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile } from '../../redux/actions/userProfileActions';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  // Новые поля для заказа
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const dispatch = useDispatch();

  const { loading, error, user } = useSelector(state => state.auth);
  const { success } = useSelector(state => state.userProfile);

  useEffect(() => {
    // Загружаем данные профиля пользователя
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

    // Загружаем данные для заказа из localStorage
    const userOrderData = localStorage.getItem('userOrderData');
    if (userOrderData) {
      const orderData = JSON.parse(userOrderData);
      setPhone(orderData.phone || '');
      setAddress(orderData.address || '');
      setCity(orderData.city || '');
      setPostalCode(orderData.postalCode || '');
      setCountry(orderData.country || '');
      setPaymentMethod(orderData.paymentMethod || 'card');
    }
  }, [dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Проверка паролей
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    // Обновить профиль пользователя (только основные данные)
    dispatch(updateUserProfile({
      name,
      email,
      password: password ? password : undefined
    }));

    // Сохраняем данные для заказа в localStorage
    const orderData = {
      phone,
      address,
      city,
      postalCode,
      country,
      paymentMethod
    };

    localStorage.setItem('userOrderData', JSON.stringify(orderData));
  };

  return (
    <div className="profile-container">
      <h2>Мой профиль</h2>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Профиль успешно обновлен</Message>}
      {loading ? <Loader /> : (
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Новые поля для данных заказа */}
          <h3>Информация для доставки</h3>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="text"
              placeholder="Введите номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Адрес</label>
            <input
              type="text"
              placeholder="Введите адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Город</label>
            <input
              type="text"
              placeholder="Введите город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Почтовый индекс</label>
            <input
              type="text"
              placeholder="Введите почтовый индекс"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Страна</label>
            <input
              type="text"
              placeholder="Введите страну"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Способ оплаты</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Карта</option>
              <option value="cash">Наличные</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileScreen;