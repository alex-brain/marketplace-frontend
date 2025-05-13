import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
} from '../../redux/actions/categoriesActions';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import Button from '../common/Buttons';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector(state => state.categories || {});

  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = items;

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const loadCategories = async () => {
      await dispatch(fetchCategories());
    };

    loadCategories();
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

  // Выбор категории для редактирования
  const handleEdit = (category) => {
    setEditMode(true);
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: null
    });
  };

  // Сброс формы
  const resetForm = () => {
    setEditMode(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      image: null
    });
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      if (editMode && selectedCategory) {
        // await dispatch(updateCategory(selectedCategory.id, formData));
        // setAlertType('success');
        // setAlertMessage('Категория успешно обновлена');
      } else {
        await dispatch(createCategory(formData));
        setAlertType('success');
        setAlertMessage('Категория успешно создана');
      }

      resetForm();
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.message || 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Удаление категории
  const handleDelete = async (categoryId) => {
   /* if (window.confirm('Вы уверены, что хотите удалить эту категорию? Это может затронуть связанные товары.')) {
      try {
        await dispatch(deleteCategory(categoryId));
        setAlertType('success');
        setAlertMessage('Категория успешно удалена');
      } catch (error) {
        setAlertType('error');
        setAlertMessage(error.message || 'Не удалось удалить категорию');
      }
    }*/
  };

  return (
    <div className="category-management">
      <h1 className="page-title">Управление категориями</h1>

      {alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage('')}
        />
      )}

      <div className="category-management-layout">
        <div className="category-form-container">
          <h2>{editMode ? 'Редактировать категорию' : 'Добавить новую категорию'}</h2>

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="name">Название категории:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Введите название категории"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                disabled={isSubmitting}
                placeholder="Введите описание категории (необязательно)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Изображение:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
                disabled={isSubmitting}
              />
              <div className="form-hint">
                Рекомендуемый размер: 200x200 пикселей
              </div>

              {editMode && selectedCategory && selectedCategory.image_url && (
                <div className="current-image">
                  <p>Текущее изображение:</p>
                  <img
                    src={`http://localhost:5000${selectedCategory.image_url}`}
                    alt={selectedCategory.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-buttons">
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {editMode ? 'Обновить категорию' : 'Добавить категорию'}
              </Button>

              {editMode && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="categories-list-container">
          <h2>Список категорий</h2>

          {loading ? (
            <Loader />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : categories.length === 0 ? (
            <div className="empty-categories">
              <p>Нет доступных категорий</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-card-header">
                    <div className="category-image">
                      {category.image_url ? (
                        <img
                          src={`http://localhost:5000${category.image_url}`}
                          alt={category.name}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="no-image">
                          <i className="fas fa-folder"></i>
                        </div>
                      )}
                    </div>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      {category.product_count !== undefined && (
                        <span className="product-count">
                          {category.product_count} товаров
                        </span>
                      )}
                    </div>
                  </div>

                  {category.description && (
                    <div className="category-description">
                      {category.description.length > 100
                        ? `${category.description.substring(0, 100)}...`
                        : category.description}
                    </div>
                  )}

                  <div className="category-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEdit(category)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(category.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;