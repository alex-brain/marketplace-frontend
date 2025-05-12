import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../../redux/actions/cartActions';
import { createOrder } from '../../redux/actions/orderActions';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, total, loading: cartLoading } = useSelector(state => state.cart);
  const cart = useSelector(state => state.cart);
  console.log('cart', cart)
  const { loading, error } = useSelector(state => state.orders);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  console.log('orders', orders)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card' // По умолчанию оплата картой
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Загрузка корзины и предзаполнение формы данными пользователя
    dispatch(fetchCart());

    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    console.log('formData', formData)
    e.preventDefault();

    if (cart.items.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }

    // Создание строки с полным адресом
    const shippingAddress = `${formData.fullName}, ${formData.phone}, ${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`;

    // Отправка заказа
    dispatch(createOrder({
      shippingAddress,
      paymentMethod: formData.paymentMethod
    })).then((success) => {
      if (success) {
        navigate('/order-confirmation');
      }
    });
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
    </div>
  );
};

export default Checkout;