import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../../redux/actions/productActions';
import { addToCart } from '../../redux/actions/cartActions';
import Loader from '../common/Loader';
import Button from '../common/Buttons';
import Alert from '../common/Alert';
import Breadcrumb from '../common/Breadcrumb';
import ImageGallery from '../common/ImageGallery';
import Tabs from '../common/Tabs';
import ProductCard from '../common/ProductCard';
// import { notify } from '../common/Notifications'; // Предполагаем, что у нас есть такой компонент
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error, relatedProducts } = useSelector(state => state.productDetails);
  
  console.log('product', product)

  const productData = product?.product
  
  const { isAuthenticated } = useSelector(state => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    // Fetch product details when component mounts or id changes
    dispatch(listProductDetails(id));

    // Reset quantity when changing product
    setQuantity(1);

    // Reset alert
    setAlertMessage('');
  }, [dispatch, id]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= productData.stock) {
      setQuantity(value);
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < productData.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    dispatch(addToCart(id, quantity))
      .then(() => {
        // Show success notification
        // notify('Товар добавлен в корзину', 'success');
      })
      .catch(error => {
        // Show error alert
        setAlertType('error');
        setAlertMessage(error.message || 'Не удалось добавить товар в корзину');
      });
  };

  // Buy now
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    // Добавляем проверку наличия достаточного количества товара
  if (quantity > productData.stock) {
    setAlertType('error');
    setAlertMessage(`Недостаточно товара на складе. Доступно: ${productData.stock} шт.`);
    return;
  }

    dispatch(addToCart(id, quantity))
      .then(() => {
        navigate('/checkout');
      })
      .catch(error => {
        setAlertType('error');
        setAlertMessage(error.message || 'Не удалось оформить заказ');
      });
  };
const getProductImages = () => {
  const images = [];
  
  // Все возможные источники изображений (в порядке приоритета)
  const imageSources = [
    // Основное изображение из productData
    productData?.image_url,
    productData?.image,
    productData?.photo,
    productData?.picture,
    
    // Изображение из объекта product
    product?.image_url,
    product?.image,
    product?.photo,
    
    // Первое изображение из массива
    product?.images?.[0]?.url,
    product?.images?.[0]?.image_url,
    product?.images?.[0]?.src,
    
    // Изображения из product.product (если есть такая вложенность)
    product?.product?.image_url,
    product?.product?.image,
  ];
  
  // Найти первое валидное изображение
  for (const source of imageSources) {
    if (source && typeof source === 'string' && source.trim() !== '') {
      images.push({
        src: source,
        alt: productData?.name || product?.name || 'Product image'
      });
      break; // Берем только первое найденное изображение
    }
  }
  
  // Если ничего не найдено, добавляем placeholder
  if (images.length === 0) {
    /*images.push({
      src: '/images/placeholder.png',
      alt: 'Изображение недоступно'
    });*/
  }
  
  return images;
};
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading || !productData) {
    return <Loader fullPage />;
  }
  
  console.log('productData', productData)

  if (error) {
    return (
      <div className="error-container">
        <h2>Произошла ошибка</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Товар не найден</h2>
        <Button to="/">Вернуться на главную</Button>
      </div>
    );
  }

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: 'Товары', path: '/products' }
  ];

  if (productData?.category_name) {
    breadcrumbItems.push({
      label: productData.category_name,
      path: `/category/${productData.category_id}`
    });
  }

  breadcrumbItems.push({ label: productData?.name });

  // Prepare images for gallery
  const productImages = getProductImages();


  // Prepare tabs
  const tabs = [
    {
      label: 'Описание',
      content: (
        <div className="product-description">
          {productData?.description ? (
            <p>{productData?.description}</p>
          ) : (
            <p>Описание товара отсутствует.</p>
          )}
        </div>
      )
    },
    {
      label: 'Характеристики',
      content: (
        <div className="product-specifications">
          {productData?.specifications && product.specifications.length > 0 ? (
            <table className="specs-table">
              <tbody>
              {productData.specifications.map((spec, index) => (
                <tr key={index}>
                  <td>{spec.name}</td>
                  <td>{spec.value}</td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <p>Характеристики товара отсутствуют.</p>
          )}
        </div>
      )
    },
    {
      label: 'Отзывы',
      content: (
        <div className="product-reviews">
          {productData?.reviews && productData.reviews.length > 0 ? (
            <div className="reviews-list">
              {productData.reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.user_name}</span>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                    <div className="review-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="review-content">{review.comment}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p>Отзывов пока нет. Станьте первым, кто оставит отзыв об этом товаре!</p>
              <Button onClick={() => alert('Функционал в разработке')}>
                Оставить отзыв
              </Button>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="product-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        {alertMessage && (
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setAlertMessage('')}
          />
        )}

        <div className="product-detail">
          <div className="product-gallery">
            <ImageGallery images={productImages} />
          </div>

          <div className="product-info">
            <h1 className="product-title">{productData?.name}</h1>

            <div className="product-meta">
              {productData.sku && (
                <div className="product-sku">Артикул: {productData.sku}</div>
              )}

              {productData.rating !== undefined && (
                <div className="product-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < productData.rating ? 'filled' : ''}`}
                    ></i>
                  ))}
                  <span>({productData.reviews_count || 0} отзывов)</span>
                </div>
              )}
            </div>

            <div className="product-price-block">
              {/*{product.old_price && product.old_price > product.price && (
                <div className="old-price">{formatPrice(product.old_price)}</div>
              )}*/}
              <div className="current-price">{productData.price}₽</div>
            </div>

            <div className="product-availability">
              {productData.stock > 0 ? (
                <span className="in-stock">В наличии: {productData.stock} шт.</span>
              ) : (
                <span className="out-of-stock">Нет в наличии</span>
              )}
            </div>

            {productData.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <button
                    className="quantity-btn"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <div className="action-buttons">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="large"
                  >
                    В корзину
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    variant="secondary"
                    size="large"
                  >
                    Купить сейчас
                  </Button>
                </div>
              </div>
            )}

            {/* Дополнительная информация */}
            <div className="additional-info">
              <div className="info-item">
                <i className="fas fa-truck"></i>
                <span>Отправка товара в течение 2 рабочих дней</span>
              </div>
              <div className="info-item">
                <i className="fas fa-undo"></i>
                <span>Возврат в течение 14 дней</span>
              </div>
              <div className="info-item">
                <i className="fas fa-shield-alt"></i>
                <span>Гарантия качества</span>
              </div>
            </div>
          </div>
        </div>

        {/* Вкладки с информацией */}
       { <div className="product-tabs">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>}

        {/* Похожие товары */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Похожие товары</h2>
            <div className="products-grid">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;