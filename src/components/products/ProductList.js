import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/actions/productActions';
import ProductCard from './ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: ''
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    dispatch(fetchProducts(filters));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list-container">
      <div className="filters">
        <h3>Фильтры</h3>
        <div className="filter-group">
          <label>Категория:</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Все категории</option>
            {/* Здесь можно добавить опции категорий из стора */}
          </select>
        </div>
        <div className="filter-group">
          <label>Цена от:</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Цена до:</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Поиск:</label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleFilterChange}
          />
        </div>
        <button onClick={applyFilters}>Применить фильтры</button>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <p>Товары не найдены</p>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;