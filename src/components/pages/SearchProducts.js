import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../../redux/actions/productActions';

const SearchProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Получаем параметр query из URL
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  // Получаем данные о продуктах из Redux store
  const productsData = useSelector((state) => state.products);

  useEffect(() => {
    // Загрузка товаров при монтировании компонента
    const loadProducts = async () => {
      await dispatch(listProducts());
    };

    loadProducts();
  }, [dispatch]);

  // Обновление строки поиска при изменении URL
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const products = productsData?.products?.products || [];

  // Фильтрация продуктов по поисковому запросу
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <section className="search-products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Поиск товаров</h2>
        </div>

        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Введите название товара"
              className="search-input"
            />
            <button type="submit" className="search-button">
              Поиск
            </button>
          </form>
        </div>

        {query && (
          <div className="search-results-info">
            <h3>Результаты поиска по запросу: "{query}"</h3>
            <p>Найдено товаров: {filteredProducts.length}</p>
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id || product._id || Math.random().toString()}
                product={product}
              />
            ))
          ) : (
            <div className="no-results">
              {query ? 'Товары не найдены. Попробуйте изменить запрос.' : 'Введите запрос для поиска товаров.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchProducts;