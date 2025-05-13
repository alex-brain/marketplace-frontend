import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import ProductCard from "../common/ProductCard";
import {useDispatch, useSelector} from "react-redux";
import {listProducts} from "../../redux/actions/productActions";
import {fetchCategories} from "../../redux/actions/categoriesActions";

const CategoryProducts = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Используем корректную структуру для селектора
  const productsData = useSelector((state) => state.products);
  const categoriesData = useSelector((state) => state.categories);
  
  console.log('categoriesData', categoriesData)

  useEffect(() => {
    // Загрузка товаров при монтировании компонента
    const loadProducts = async () => {
      await dispatch(listProducts());
      await dispatch(fetchCategories());
    };

    loadProducts();
  }, []);
  
  console.log('productsData', productsData)

  const products = productsData?.products?.products;

  const filteredProducts = (products && products.filter(item => item.category_id === parseInt(id))) || [];

  const category = categoriesData?.items.find(item => item.id === parseInt(id));

  return (
    <section id={id} className={`products-section`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{category?.name}</h2>
          {/*{link && (
            <Link to={link} className="section-link">
              {linkText || 'Смотреть все'}
            </Link>
          )}*/}
        </div>
        <div className="products-grid">
          {filteredProducts && filteredProducts.map(product => (
            <ProductCard
              key={product.id || product._id || Math.random().toString()}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts;