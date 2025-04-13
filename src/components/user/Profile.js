import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, changePassword } from '../../redux/actions/userActions';
import { fetchUserOrders } from '../../redux/actions/orderActions';
import Button from '../common/Button';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import Tabs from '../common/Tabs';
import OrderItem from '../orders/OrderItem';
import FormInput from '../common/FormInput';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading, error: userError } = useSelector(state => state.auth);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector(state => state.orders);

  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Форма профиля
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Форма для смены пароля
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Заполняем форму данными пользователя при загрузке
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }

    // Загрузка заказов пользователя
    dispatch(fetchUserOrders());
  }, [dispatch, user]);

  // Обработчик изменения полей формы профиля
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик изменения полей формы пароля
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Валидация формы профиля
  const validateProfileForm = () => {
    const errors = {};

    if (!profileForm.name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
    }

    if (!profileForm.email.trim()) {
      errors.email = 'Email обязателен для заполнения';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Введите корректный email';
    }

    return errors;
  };

  // Валидация формы смены пароля
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Введите текущий пароль';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'Введите новый пароль';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Пароль должен быть не менее 8 символов';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    return errors;
  };

  // Отправка формы профиля
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      await dispatch(updateUserProfile(profileForm));

      setAlert({
        show: true,
        message: 'Профиль успешно обновлен',
        type: 'success'
      });

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 5000);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || 'Не удалось обновить профиль',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Отправка формы смены пароля
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      await dispatch(changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }));

      // Очищаем форму после успешной смены пароля
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setAlert({
        show: true,
        message: 'Пароль успешно изменен',
        type: 'success'
      });

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 5000);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || 'Не удалось изменить пароль',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Содержимое вкладок
  const tabs = [
    {
      label: 'Мой профиль',
      icon: <i className="fas fa-user"></i>,
      content: (
        <div className="profile-form-container">
          <form onSubmit={handleProfileSubmit}>
            <FormInput
              label="Имя"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              error={validationErrors.name}
              required
              disabled={isSubmitting}
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              error={validationErrors.email}
              required
              disabled={isSubmitting}
            />

            <FormInput
              label="Телефон"
              type="tel"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              error={validationErrors.phone}
              disabled={isSubmitting}
            />

            <FormInput
              label="Адрес доставки"
              type="textarea"
              name="address"
              value={profileForm.address}
              onChange={handleProfileChange}
              error={validationErrors.address}
              rows={3}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Сохранить изменения
            </Button>
          </form>
        </div>
      )
    },
    {
      label: 'Безопасность',
      icon: <i className="fas fa-lock"></i>,
      content: (
        <div className="profile-form-container">
          <form onSubmit={handlePasswordSubmit}>
            <FormInput
              label="Текущий пароль"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={validationErrors.currentPassword}
              required
              disabled={isSubmitting}
            />

            <FormInput
              label="Новый пароль"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={validationErrors.newPassword}
              required
              disabled={isSubmitting}
              helperText="Минимум 8 символов"
            />

            <FormInput
              label="Подтверждение пароля"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              error={validationErrors.confirmPassword}
              required
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Изменить пароль
            </Button>
          </form>
        </div>
      )
    },
    {
      label: 'Мои заказы',
      icon: <i className="fas fa-shopping-bag"></i>,
      content: (
        <div className="user-orders">
          {ordersLoading ? (
            <Loader />
          ) : ordersError ? (
            <Alert
              type="error"
              message={ordersError}
            />
          ) : orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="empty-orders">
              <div className="empty-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>У вас пока нет заказов</h3>
              <p>Перейдите в каталог, чтобы сделать первый заказ</p>
              <Button to="/products">Перейти в каталог</Button>
            </div>
          )}
        </div>
      )
    }
  ];

  if (userLoading && !user) {
    return <Loader fullPage />;
  }

  if (userError) {
    return (
      <div className="error-container">
        <h2>Ошибка загрузки профиля</h2>
        <p>{userError}</p>
        <Button onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <h1>{user?.name}</h1>
              <p>{user?.email}</p>
              <p className="user-since">
                Пользователь с {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, message: '', type: '' })}
          />
        )}

        <div className="profile-content">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;