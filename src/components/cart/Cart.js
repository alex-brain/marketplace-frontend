import React, { useEffect } from 'react';
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
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cart-container">
      <h2>Корзина</h2>

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
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
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

            <Link to="/checkout" className="checkout-button">
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