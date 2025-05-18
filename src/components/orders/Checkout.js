import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../../redux/actions/cartActions';
import { createOrder } from '../../redux/actions/orderActions';
import './Checkout.css'; // Предполагаю, что есть файл стилей

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, total, loading: cartLoading } = useSelector(state => state.cart);
  const cart = useSelector(state => state.cart);
  const { loading, error } = useSelector(state => state.orders);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Добавляем состояние для модального окна
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card'
  });

  // Переменная для хранения данных заказа перед оплатой
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    dispatch(fetchCart());

    let userData = {
      fullName: user?.name || '',
      email: user?.email || '',
    };

    const userOrderData = localStorage.getItem('userOrderData');
    if (userOrderData) {
      const orderData = JSON.parse(userOrderData);

      userData = {
        ...userData,
        phone: orderData.phone || '',
        address: orderData.address || '',
        city: orderData.city || '',
        postalCode: orderData.postalCode || '',
        country: orderData.country || '',
        paymentMethod: orderData.paymentMethod || 'card'
      };
    }

    setFormData(userData);

  }, [dispatch, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.items.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }

    const orderDataForStorage = {
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      paymentMethod: formData.paymentMethod
    };
    localStorage.setItem('userOrderData', JSON.stringify(orderDataForStorage));

    const shippingAddress = `${formData.fullName}, ${formData.phone}, ${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`;

    // Если выбрана оплата картой, показываем модалку
    if (formData.paymentMethod === 'card') {
      setOrderData({
        shippingAddress,
        paymentMethod: formData.paymentMethod
      });
      setShowPaymentModal(true);
    } else {
      // Иначе оформляем заказ как обычно
      processOrder({
        shippingAddress,
        paymentMethod: formData.paymentMethod
      });
    }
  };

  // Новая функция для обработки оформления заказа
  const processOrder = (data) => {
    dispatch(createOrder(data)).then((success) => {
      if (success) {
        navigate('/order-confirmation');
      }
    });
  };

  // Функция закрытия модального окна
  const closeModal = () => {
    setShowPaymentModal(false);
    setOrderData(null);
  };

  // Функция обработки подтверждения оплаты
  const handlePaymentConfirmation = () => {
    if (orderData) {
      processOrder(orderData);
    }
    setShowPaymentModal(false);
  };

  if (cartLoading) return <div>Загрузка корзины...</div>;
  if (!cart.items || cart.items.length === 0) return <div>Ваша корзина пуста. <button onClick={() => navigate('/')}>Вернуться к покупкам</button></div>;

  return (
    <div className="checkout-container">
      <h2>Оформление заказа</h2>

      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Информация для доставки</h3>
          <form onSubmit={handleSubmit}>
            {/* Сохраняем все поля формы без изменений */}
            <div className="form-group">
              <label>ФИО:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Телефон:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Адрес:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Город:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Почтовый индекс:</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Страна:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <h3>Способ оплаты</h3>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <label htmlFor="card">Оплата картой</label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleChange}
                />
                <label htmlFor="cash">Оплата при получении</label>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>

            {error && <div className="error">{error}</div>}
          </form>
        </div>

        <div className="order-summary">
          <h3>Ваш заказ</h3>
          <div className="summary-orders">
            {cart.items.map(item => (
              <div key={item.id} className="summary-item">
                <div className="item-name">
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                </div>
                <div className="item-price">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Итого:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Модальное окно для оплаты картой */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h3>Информация для оплаты</h3>
            <p>Пожалуйста, переведите сумму ${total.toFixed(2)} на карту:</p>
            <div className="card-number">1234 5678 9012 3456</div>
            <p>После перевода нажмите кнопку "Оплатил"</p>
            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={closeModal}
              >
                Закрыть
              </button>
              <button
                className="confirm-btn"
                onClick={handlePaymentConfirmation}
              >
                Оплатил
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;