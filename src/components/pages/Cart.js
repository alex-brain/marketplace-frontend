import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios'; // Временно используем axios напрямую, пока не решим проблему с API
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const { isAuthenticated } = authState;
  

    useEffect(() => {
        if (!isAuthenticated) {
          navigate('/login');
        } else {
          fetchCart();
        }
      }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Используем axios напрямую, пока не настроим импорт API
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(`Не удалось загрузить корзину: ${err.response?.data?.message || err.message}`);
      toast.error('Ошибка при загрузке корзины');
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        return;
      }
      
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/cart/items/${itemId}`, 
        { quantity }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
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
      
      toast.success('Количество товара обновлено');
    } catch (err) {
      console.error("Error updating cart item:", err);
      toast.error(err.response?.data?.message || 'Ошибка при обновлении количества');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Обновляем локальное состояние
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);
        
        const newTotal = updatedItems.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);
        
        return { ...prevCart, items: updatedItems, total: newTotal };
      });
      
      toast.success('Товар удален из корзины');
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error('Ошибка при удалении товара');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCart({ ...cart, items: [], total: 0 });
      toast.success('Корзина очищена');
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error('Ошибка при очистке корзины');
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <div className="cart-container loading">Загрузка корзины...</div>;
  }

  if (error) {
    return <div className="cart-container error">{error}</div>;
  }

  if (!cart.items || cart.items.length === 0) {
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
      
      <div className="cart-items">
        {cart.items.map((item) => (
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
            </div>
            
            <div className="item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
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
          <h3>{cart.total} ₽</h3>
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