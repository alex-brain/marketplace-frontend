import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import { addToCart } from '../redux/actions/cartActions';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} className="product-image" />
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price}</p>
          <button 
            onClick={() => handleAddToCart(product)}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 