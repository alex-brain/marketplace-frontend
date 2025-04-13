import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/actions/productActions';
// import { fetchCategories } from '../../redux/actions/categoryActions';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';
// import Carousel from '../common/Carousel'; // Предположим, у нас есть компонент для слайдера
import Button from '../common/Buttons';
// import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { items: productItems, loading, error } = useSelector((state) => state.products);
  const { items } = useSelector((state) => state.categories);

  console.log('productItems', productItems)

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  // Баннеры для слайдера
  const banners = [
    {
      id: 1,
      image: '/images/banners/banner1.jpg',
      title: 'Новая коллекция',
      subtitle: 'Скидки до 30%',
      link: '/category/new-collection'
    },
    {
      id: 2,
      image: '/images/banners/banner2.jpg',
      title: 'Распродажа сезона',
      subtitle: 'Выгодные предложения',
      link: '/sale'
    },
    {
      id: 3,
      image: '/images/banners/banner3.jpg',
      title: 'Эксклюзивные товары',
      subtitle: 'Только у нас',
      link: '/exclusive'
    }
  ];

  useEffect(() => {
    // Загрузка категорий и товаров при монтировании компонента
    // dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // При получении продуктов, распределяем их по группам
    if (productItems.length > 0) {
      // Устанавливаем избранные товары (например, с пометкой featured)
      const featured = productItems.filter(product => product.featured);
      setFeaturedProducts(featured.slice(0, 8));

      // Сортируем по дате создания для новых поступлений
      const newProducts = [...productItems].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      setNewArrivals(newProducts.slice(0, 8));

      // Для примера: товары с наибольшими продажами
      const popular = [...productItems].sort((a, b) =>
        (b.sales_count || 0) - (a.sales_count || 0)
      );
      setBestSellers(popular.slice(0, 8));
    }
  }, [productItems]);

  // Функция для отображения категорий
  const renderCategories = () => {
    if (items.length === 0) return null;

    return (
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Категории</h2>
          <div className="categories-grid">
            {items.map(category => (
              <Link
                to={`/category/${category.id}`}
                className="category-card"
                key={category.id}
              >
                {category.image_url && (
                  <div className="category-image">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                )}
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Функция для отображения секции товаров
  const renderProductSection = (title, productItems, link, linkText) => {
    if (productItems.length === 0) return null;

    return (
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            {link && (
              <Link to={link} className="section-link">
                {linkText || 'Смотреть все'}
              </Link>
            )}
          </div>
          <div className="products-grid">
            {productItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  if (loading && productItems.length === 0) {
    return <Loader fullPage />;
  }

  if (error && productItems.length === 0) {
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

  return (
    <div className="home-page">
      {/* Слайдер с баннерами */}
      {/*<Carousel items={banners} />*/}

      {/* Секция категорий */}
      {renderCategories()}

      {/* Секция с избранными товарами */}
      {renderProductSection('Рекомендуемые товары', featuredProducts, '/featured', 'Все рекомендуемые')}

      {/* Секция с новыми поступлениями */}
      {renderProductSection('Новые поступления', newArrivals, '/new-arrivals', 'Все новинки')}

      {/* Промо-баннер */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h2>Специальное предложение</h2>
            <p>Скидка 15% на все товары до конца месяца!</p>
            <Button to="/sale" variant="secondary" size="large">
              Перейти к акции
            </Button>
          </div>
        </div>
      </section>

      {/* Секция с лидерами продаж */}
      {renderProductSection('Лидеры продаж', bestSellers, '/best-sellers', 'Все бестселлеры')}

      {/* Преимущества магазина */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Быстрая доставка</h3>
              <p>Доставляем заказы по всей стране за 1-3 дня</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Гарантия качества</h3>
              <p>Проверяем все товары перед отправкой</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Простой возврат</h3>
              <p>14 дней на возврат товара без вопросов</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Поддержка 24/7</h3>
              <p>Всегда на связи и готовы помочь вам</p>
            </div>
          </div>
        </div>
      </section>

      {/* Подписка на рассылку */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Подпишитесь на нашу рассылку</h2>
            <p>Будьте в курсе новых поступлений и специальных предложений</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Ваш email"
                required
              />
              <Button type="submit">Подписаться</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;