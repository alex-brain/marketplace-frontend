import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchCart,
  updateCartItem,
  removeFromCart
} from '../../redux/actions/cartActions';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, total } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Добавляем состояние для отслеживания ошибок по наличию товаров
  const [stockErrors, setStockErrors] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem(itemId, quantity));
    // Сбрасываем ошибки при изменении количества
    setStockErrors([]);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    // Сбрасываем ошибки при удалении товара
    setStockErrors([]);
  };

  // Функция для проверки наличия товаров перед переходом к оформлению
  const checkStockAvailability = () => {
    const errors = [];

    items.forEach(item => {
      if (item.quantity > item.product.stock) {
        errors.push({
          productId: item.product.id,
          productName: item.product.name,
          requestedQuantity: item.quantity,
          availableStock: item.product.stock
        });
      }
    });

    return errors;
  };

  const onCheckout = (e) => {
    e.preventDefault();

    // Проверяем наличие товаров
    const stockIssues = checkStockAvailability();
    console.log('stockIssues', stockIssues)

    if (stockIssues.length > 0) {
      // Если есть проблемы с наличием, отменяем переход и показываем ошибки
      setStockErrors(stockIssues);
      // Прокручиваем страницу вверх, чтобы ошибки были видны
      window.scrollTo(0, 0);
    } else {
      // Если всё в порядке, очищаем ошибки
      setStockErrors([]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cart-container">
      <h2>Корзина</h2>

      {/* Отображение ошибок по наличию товаров */}
      {stockErrors.length > 0 && (
        <div className="stock-errors">
          <h3>Невозможно оформить заказ</h3>
          <ul>
            {stockErrors.map((error, index) => (
              <li key={index} className="stock-error-item">
                Товар "{error.productName}" - запрошено {error.requestedQuantity} шт.,
                но на складе доступно только {error.availableStock} шт.
              </li>
            ))}
          </ul>
          <p>Пожалуйста, уменьшите количество или удалите товары, которых нет в наличии.</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
          <Link to="/">Перейти к покупкам</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.product.image_url ? (
                    <img
                      src={`http://localhost:5000${item.product.image_url}`}
                      alt={item.product.name}
                    />
                  ) : (
                    <div className="no-image">Нет изображения</div>
                  )}
                </div>

                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-price">${item.product.price.toFixed(2)}</p>

                  {/* Показываем информацию о наличии */}
                  <p className="item-stock">
                    В наличии: {item.product.stock} шт.
                    {item.quantity > item.product.stock && (
                      <span className="stock-warning"> (Недостаточно!)</span>
                    )}
                  </p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className={item.quantity > item.product.stock ? "quantity-error" : ""}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-item"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Итого:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link onClick={onCheckout} to="/checkout" className="checkout-button">
              Оформить заказ
            </Link>

            <Link to="/" className="continue-shopping">
              Продолжить покупки
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;