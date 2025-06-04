import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../redux/actions/authActions';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Очищаем возможные ошибки при монтировании компонента
    // dispatch(clearError());

    // Если пользователь уже авторизован, перенаправляем его
    if (isAuthenticated) {
      navigate('/');
    }
  }, [dispatch, isAuthenticated, navigate]);

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Очищаем ошибку поля при изменении
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await dispatch(register({
          name: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })).unwrap();

        // Если успешно, будет перенаправление в useEffect
      } catch (err) {
        // Ошибка уже обработана в action
        setIsSubmitting(false);
      }
    }
  };

  // Регистрация через Google
  const handleGoogleRegister = () => {
    // Реализация OAuth с Google
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  // Регистрация через Facebook
  const handleFacebookRegister = () => {
    // Реализация OAuth с Facebook
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
  };

  return (
    <div className="register-form-container">
      <div className="register-form-wrapper">
        <h2 className="register-form-title">Создать аккаунт</h2>
        <p className="register-form-subtitle">Заполните поля формы для создания вашего профиля</p>

        {error && (
          <div className="register-form-error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Фамилия</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ваша фамилия"
                className={formErrors.firstName ? 'input-error' : ''}
                disabled={loading}
              />
              {formErrors.firstName && <p className="error-text">{formErrors.firstName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Имя</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ваше имя"
                className={formErrors.lastName ? 'input-error' : ''}
                disabled={loading}
              />
              {formErrors.lastName && <p className="error-text">{formErrors.lastName}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={formErrors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {formErrors.email && <p className="error-text">{formErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Придумайте пароль"
              className={formErrors.password ? 'input-error' : ''}
              disabled={loading}
            />
            {formErrors.password && <p className="error-text">{formErrors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Подтвердите свой пароль"
              className={formErrors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
            />
            {formErrors.confirmPassword && <p className="error-text">{formErrors.confirmPassword}</p>}
          </div>

          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="agreeTerms">
              Я соглашаюсь с <Link to="/terms" className="terms-link"> Правилами обработки личных данных</Link> и <Link to="/privacy" className="terms-link">Политикой конфиденциальности</Link>
            </label>
            {formErrors.agreeTerms && <p className="error-text">{formErrors.agreeTerms}</p>}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading || isSubmitting}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <div className="register-form-footer">
          <p>
            Уже есть аккаунт? <Link to="/login" className="login-link">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;