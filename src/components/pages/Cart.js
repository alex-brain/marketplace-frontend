import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Cart.css';
import { fetchCart } from "../../redux/actions/cartActions";

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Добавляем состояние для отслеживания ошибок по наличию товаров
  const [stockErrors, setStockErrors] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const cartState = useSelector(state => state.cart);
  const { isAuthenticated } = authState;

  console.log('cartState', cartState)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, navigate]);

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        return;
      }

      const token = localStorage.getItem('auth_token');
      await axios.put(`http://localhost:5000/api/cart/items/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      await dispatch(fetchCart());

      // Обновляем локальное состояние
      setCart(prevCart => {
        const updatedItems = prevCart.items.map(item => {
          if (item.id === itemId) {
            return { ...item, quantity };
          }
          return item;
        });

        const newTotal = updatedItems.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);

        return { ...prevCart, items: updatedItems, total: newTotal };
      });

      // Сбрасываем ошибки при изменении количества
      setStockErrors([]);
      toast.success('Количество товара обновлено');
    } catch (err) {
      console.error("Error updating cart item:", err);
      toast.error(err.response?.data?.message || 'Ошибка при обновлении количества');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`http://localhost:5000/api/cart/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await dispatch(fetchCart());

      // Обновляем локальное состояние
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);

        const newTotal = updatedItems.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);

        return { ...prevCart, items: updatedItems, total: newTotal };
      });

      // Сбрасываем ошибки при удалении товара
      setStockErrors([]);
      toast.success('Товар удален из корзины');
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error('Ошибка при удалении товара');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });

      await dispatch(fetchCart());

      setCart({items:[],total:0})
      // Сбрасываем ошибки при очистке корзины
      setStockErrors([]);
      toast.success('Корзина очищена');
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error('Ошибка при очистке корзины');
    }
  };

  // Функция для проверки наличия товаров перед переходом к оформлению
  const checkStockAvailability = () => {
    const errors = [];

    if (cartState.items && cartState.items.length > 0) {
      cartState.items.forEach(item => {
        if (item.quantity > item.product.stock) {
          errors.push({
            productId: item.product.id,
            productName: item.product.name,
            requestedQuantity: item.quantity,
            availableStock: item.product.stock
          });
        }
      });
    }

    return errors;
  };

  const proceedToCheckout = () => {
    // Проверяем наличие товаров
    const stockIssues = checkStockAvailability();

    if (stockIssues.length > 0) {
      // Если есть проблемы с наличием, показываем ошибки
      setStockErrors(stockIssues);
      // Прокручиваем страницу вверх, чтобы ошибки были видны
      window.scrollTo(0, 0);
      toast.error('Невозможно оформить заказ. Проверьте наличие товаров.');
    } else {
      // Если всё в порядке, очищаем ошибки и переходим к оформлению
      setStockErrors([]);
      navigate('/checkout');
    }
  };

  if (cartState.loading) {
    return <div className="cart-container loading">Загрузка корзины...</div>;
  }

  if (error) {
    return <div className="cart-container error">{error}</div>;
  }

  if (!cartState.items || cartState.items.length === 0) {
    return (
      <div className="cart-container empty">
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы продолжить покупки</p>
        <Link to="/" className="btn btn-primary">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Корзина покупок</h1>

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
          <p>Пожалуйста, уменьшите количество или удалите товары, которых нет в достаточном количестве.</p>
        </div>
      )}

      <div className="cart-items">
        {cartState.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img
                src={item.product.image_url || '/placeholder.png'}
                alt={item.product.name}
              />
            </div>

            <div className="item-details">
              <h3>{item.product.name}</h3>
              <p className="item-price">{item.product.price} ₽</p>
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
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className={item.quantity > item.product.stock ? "quantity-error" : ""}>
                                {item.quantity}
                            </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="item-total">
              <p>{item.product.price * item.quantity} ₽</p>
            </div>

            <div className="item-actions">
              <button
                className="remove-item"
                onClick={() => removeItem(item.id)}
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Итого:</h3>
          <h3>{cartState.total} ₽</h3>
        </div>

        <div className="cart-actions">
          <button className="btn btn-secondary" onClick={clearCart}>
            Очистить корзину
          </button>
          <button className="btn btn-primary" onClick={proceedToCheckout}>
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;