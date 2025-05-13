
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../../redux/actions/productActions';
// import { fetchCategories } from '../../redux/actions/categoryActions';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';
import Button from '../common/Buttons';
import './Home.css';
import {fetchCategories} from "../../redux/actions/categoriesActions";

// Карусель компонент для слайдера
const Carousel = ({ items = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Автоматическое переключение слайдов
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [items.length]);

  const goToSlide = (index) => {
    clearInterval(intervalRef.current);
    setCurrentSlide(index);
    
    // Восстанавливаем автоматическое переключение
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);
  };

  if (!items.length) return null;

  return (
    <div className="carousel">
      {items.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img src={slide.image} alt={slide.title} />
          <div className="carousel-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
            <Button to={slide.link} variant="primary">Подробнее</Button>
          </div>
        </div>
      ))}
      <div className="carousel-controls">
        {items.map((_, index) => (
          <div 
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  
  // Используем корректную структуру для селектора
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  
  // Создаем совместимую с кодом структуру productItems
  const productItems = products || [];
  
  const { items = [] } = useSelector((state) => state.categories || {});

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [inViewSections, setInViewSections] = useState({});

  // Баннеры для слайдера
  const banners = [
    {
      id: 1,
      image: 'https://sun9-70.userapi.com/impg/cqGAwq05rcffd85k9R-rI6k8FOTG1nQPfUwYRA/_LDR0YvxbsU.jpg?size=1080x1080&quality=95&sign=1043c752f20832a2a950f465f829cdef&type=album',
      title: 'Новая коллекция страйкбольного оружия',
      subtitle: 'Скидки до 30% на все реплики M4 серии',
      link: '/category/assault-rifles'
    },
    {
      id: 2,
      image: '/images/banners/banner2.jpg',
      title: 'Тактическое снаряжение',
      subtitle: 'Плейткарриеры, подсумки и разгрузки для любого сценария',
      link: '/category/tactical-gear'
    },
    {
      id: 3,
      image: '/images/banners/banner3.jpg',
      title: 'Экипировка для начинающих',
      subtitle: 'Стартовые комплекты со скидкой до 20%',
      link: '/category/beginner-kits'
    }
  ];

  // Отслеживание видимых секций для анимации
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInViewSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    // Загрузка товаров при монтировании компонента
    const loadProducts = async () => {
      await dispatch(listProducts());
      await dispatch(fetchCategories());
      console.log('Товары после загрузки:', productItems); // Добавьте это
      // После первой загрузки изменяем флаг
      setTimeout(() => {
        setIsFirstLoad(false);
      }, 1000); // Даем небольшую задержку для улучшения UX
    };
    
    loadProducts();
    
    // Для автоматического воспроизведения видео при загрузке
    const handleAutoplayVideos = () => {
      const videos = document.querySelectorAll('video[autoplay]');
      videos.forEach(video => {
        video.play().catch(err => {
          console.log('Автовоспроизведение видео отключено браузером:', err);
        });
      });
    };
    
    window.addEventListener('load', handleAutoplayVideos);
    
    return () => {
      window.removeEventListener('load', handleAutoplayVideos);
    };
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(products?.products) && products?.products.length > 0) {
      // Обработка полученных продуктов
      const enhancedProducts = products?.products.map(product => {
        const enhanced = { ...product };
        
        // Проверка на новинки - товары созданные в последние 14 дней
        if (product.created_at && new Date(product.created_at) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) {
          enhanced.isNew = true;
        }
        
        // Для товаров со скидкой
        if (product.discount > 0) {
          enhanced.onSale = true;
          enhanced.discountPercent = product.discount;
        }
        
        return enhanced;
      });
      
      // Настройка разных секций с товарами
      setFeaturedProducts(enhancedProducts.filter(p => p.featured).slice(0, 8));
      
      // Сортируем по дате создания для новых поступлений
      const newProducts = [...enhancedProducts].sort((a, b) => 
        new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now())
      );
      setNewArrivals(newProducts.slice(0, 8));
  
      // Сортируем по популярности
      const popular = [...enhancedProducts].sort((a, b) => 
        (b.sales_count || 0) - (a.sales_count || 0)
      );
      setBestSellers(popular.slice(0, 8));
    }
  }, [products]);

  // Функция для отображения категорий
  const renderCategories = () => {
    // Если нет категорий, создаем демо-категории
    const categoriesToRender = Array.isArray(items) && items.length > 0 
      ? items 
      : [
        { id: 1, name: 'Оружие', image_url: '/images/categories/weapons.jpg' },
        { id: 2, name: 'Снаряжение', image_url: '/images/categories/gear.jpg' },
        { id: 3, name: 'Защита', image_url: '/images/categories/protection.jpg' },
        { id: 4, name: 'Расходники', image_url: '/images/categories/consumables.jpg' },
        { id: 5, name: 'Аксессуары', image_url: '/images/categories/accessories.jpg' },
        { id: 6, name: 'Одежда', image_url: '/images/categories/clothing.jpg' }
      ];

    return (
      <section id="categories-section" className={`categories-section ${inViewSections['categories-section'] ? 'animate-in' : ''}`}>
        <div className="container">
          <h2 className="section-title">Категории товаров</h2>
          <div className="categories-grid">
            {categoriesToRender.map(category => (
              <Link
                to={`/categories/${category.id}`}
                className="category-card"
                key={category.id}
              >
                <div className="category-image">
                  {/*<img
                    src={category.image_url}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />*/}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Функция для отображения секции товаров с проверкой на наличие данных
  const renderProductSection = (id, title, products = [], link, linkText) => {
    if (!Array.isArray(products) || products.length === 0) {
      return null;
    }

    return (
      <section id={id} className={`products-section ${inViewSections[id] ? 'animate-in' : ''}`}>
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
            {products.map(product => (
              <ProductCard 
                key={product.id || product._id || Math.random().toString()} 
                product={product}
              >
                {/* Отображаем бейджи для специальных товаров */}
                {product.isNew && <div className="product-badge new">Новинка</div>}
                {product.onSale && <div className="product-badge sale">-{product.discountPercent}%</div>}
                {product.isBestseller && <div className="product-badge bestseller">Хит</div>}
              </ProductCard>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Показываем загрузчик только в первый раз
  if ((loading && isFirstLoad) || (isFirstLoad && !productItems.length)) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loader-text">Загружаем лучшие товары для страйкбола...</div>
      </div>
    );
  }

  // Показываем ошибку только если нет товаров
  if (error && !productItems.length) {
    return (
      <div className="error-container">
        <h2>Произошла ошибка при загрузке товаров</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Слайдер с баннерами */}
      <Carousel items={banners} />

      {/* Секция категорий */}
      {renderCategories()}

      {/* Секция с избранными товарами */}
      {renderProductSection('featured-section', 'Рекомендуемые товары', featuredProducts, '/featured', 'Все рекомендуемые')}

      {/* Секция с новыми поступлениями */}
      {renderProductSection('new-arrivals-section', 'Новые поступления', newArrivals, '/new-arrivals', 'Все новинки')}

      {/* Промо-баннер */}
      <section id="promo-section" className={`promo-banner ${inViewSections['promo-section'] ? 'animate-in' : ''}`}>
        <div className="container">
          <div className="promo-content">
            <h2>Специальное предложение для команд</h2>
            <p>Скидка 15% на групповые заказы от 5 комплектов экипировки!</p>
            <Button to="/team-offers" variant="secondary" size="large">
              Узнать условия
            </Button>
          </div>
        </div>
      </section>

      {/* Секция с лидерами продаж */}
      {renderProductSection('bestsellers-section', 'Лидеры продаж', bestSellers, '/best-sellers', 'Все бестселлеры')}

      {/* Преимущества магазина */}
      <section id="features-section" className={`features-section ${inViewSections['features-section'] ? 'animate-in' : ''}`}>
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3>Проверенное качество</h3>
              <p>Тестируем каждую единицу оружия перед отправкой. Гарантия надежности и долговечности.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-truck-fast"></i>
              </div>
              <h3>Быстрая доставка</h3>
              <p>Отправляем заказы в день оплаты. Доставка по России от 1 до 5 дней.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Официальная гарантия</h3>
              <p>Предоставляем гарантию на все товары от производителя и дополнительный сервис.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Сообщество игроков</h3>
              <p>Регулярные игры, мероприятия и тренировки для наших клиентов и команд.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Подписка на рассылку */}
      <section id="newsletter-section" className={`newsletter-section ${inViewSections['newsletter-section'] ? 'animate-in' : ''}`}>
        <div className="container">
          <div className="newsletter-content">
            <h2>Узнавайте первыми о новинках и скидках</h2>
            <p>Подписывайтесь на нашу рассылку и получайте эксклюзивные предложения, советы по игре и информацию о турнирах</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Ваш email"
                required
              />
              <Button type="submit" variant="primary">Подписаться</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;