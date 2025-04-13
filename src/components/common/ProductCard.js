import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../../redux/actions/cartActions';
import Rating from './Rating';
import Button from './Buttons';
// import './ProductCard.css';

const ProductCard = ({
                       product,
                       showAddToCart = true,
                       variant = 'default' // default, compact, horizontal
                     }) => {
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

    // dispatch(addToCart(product.id, 1));
  };

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`product-card product-card-${variant}`}>
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          {product.discount > 0 && (
            <div className="product-badge">-{product.discount}%</div>
          )}
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.png';
              }}
            />
          ) : (
            <div className="placeholder-image">
              <i className="fas fa-image"></i>
            </div>
          )}
        </div>

        <div className="product-info">
          {product.category_name && (
            <div className="product-category">{product.category_name}</div>
          )}

          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating">
            <Rating value={product.rating || 0} readOnly size="small" showText={false} />
            {product.reviews_count > 0 && (
              <span className="reviews-count">({product.reviews_count})</span>
            )}
          </div>

          <div className="product-price">
            {product.old_price && (
              <span className="old-price">{formatPrice(product.old_price)}</span>
            )}
            <span className="current-price">{formatPrice(product.price)}</span>
          </div>

          {variant === 'horizontal' && product.description && (
            <p className="product-description">
              {product.description.length > 120
                ? product.description.substring(0, 120) + '...'
                : product.description}
            </p>
          )}
        </div>
      </Link>

      {showAddToCart && (
        <div className="product-actions">
          <Button
            variant={product.stock > 0 ? 'primary' : 'disabled'}
            size="small"
            fullWidth
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;