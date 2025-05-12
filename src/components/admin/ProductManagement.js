import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
//  fetchProducts,
  createProduct, listProducts,
  //updateProduct,
  //deleteProduct
} from '../../redux/actions/productActions';
//import { fetchCategories } from '../../redux/actions/categoryActions';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector(state => state.products || {});
  const { categories = [] } = useSelector(state => state.categories || {});
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });
  
  // // Загрузка товаров и категорий при монтировании компонента
   useEffect(() => {
     const loadProducts = async () => {
       await dispatch(listProducts());
     };

     loadProducts();
     }, [dispatch]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Выбор товара для редактирования
  const handleEdit = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category_id: product.category_id || '',
      image: null
    });
  };

  // Сброс формы
  const resetForm = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: null
    });
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('editMode, selectedProduct', editMode, selectedProduct)

    if (editMode && selectedProduct) {
  //    dispatch(updateProduct(selectedProduct.id, formData));
    } else {
      console.log('createProduct')
      dispatch(createProduct(formData));
    }

    resetForm();
  };

  // Удаление товара
  const handleDelete = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
  //    dispatch(deleteProduct(productId));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const productList = products?.products || [];

  return (
    <div className="product-management">
      <h2>{editMode ? 'Редактировать товар' : 'Добавить новый товар'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название товара:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Цена:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Количество в наличии:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Категория:</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value="">Выберите категорию</option>
            {categories && categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Изображение:</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          {editMode && selectedProduct && selectedProduct.image_url && (
            <div className="current-image">
              <p>Текущее изображение:</p>
              <img
                src={`http://localhost:5000${selectedProduct.image_url}`}
                alt={selectedProduct.name}
                style={{ width: '100px' }}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  e.target.onerror = null;
                }}
              />
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editMode ? 'Обновить товар' : 'Добавить товар'}
          </button>
          {editMode && (
            <button type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <h2>Список товаров</h2>
      <table className="products-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Изображение</th>
          <th>Название</th>
          <th>Категория</th>
          <th>Цена</th>
          <th>В наличии</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        {productList && productList.length > 0 ? (
          productList.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {product.image_url ? (
                  <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    style={{ width: '50px', height: '50px' }}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  'Нет'
                )}
              </td>
              <td>{product.name || 'Без названия'}</td>
              <td>{product.category_name || 'Без категории'}</td>
              <td>${(parseFloat(product.price) || 0).toFixed(2)}</td>
              <td>{product.stock || 0}</td>
              <td>
                <button onClick={() => handleEdit(product)}>
                  Редактировать
                </button>
                <button onClick={() => handleDelete(product.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" style={{ textAlign: 'center' }}>
              Нет доступных товаров
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;