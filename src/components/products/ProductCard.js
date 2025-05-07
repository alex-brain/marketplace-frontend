import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';
import Rating from './Rating';
import Button from './Buttons';
// import './ProductCard.css';

const ProductCard = ({ product,showAddToCart=true,variant='default' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    dispatch(addToCart(product.id, 1)); // Вызываем действие addToCart
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image">
          {product.image_url ? (
            <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
          ) : (
            <div className="no-image">Нет изображения</div>
          )}
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-category">{product.category_name}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
      </button>
    </div>
  );
};

export default ProductCard;