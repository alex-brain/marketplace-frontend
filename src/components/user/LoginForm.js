import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../redux/actions/authActions';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  // Проверка, есть ли редирект после логина
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Очищаем возможные ошибки при монтировании компонента
    // dispatch(clearError());

    // Если пользователь уже авторизован, перенаправляем его
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [dispatch, isAuthenticated, navigate, from]);

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await dispatch(login({
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

  // Авторизация через Google
  const handleGoogleLogin = () => {
    // Реализация OAuth с Google
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  // Авторизация через Facebook
  const handleFacebookLogin = () => {
    // Реализация OAuth с Facebook
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
  };

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <h2 className="login-form-title">Sign In</h2>
        <p className="login-form-subtitle">Welcome back! Please enter your details</p>

        {error && (
          <div className="login-form-error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={formErrors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {formErrors.email && <p className="error-text">{formErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={formErrors.password ? 'input-error' : ''}
              disabled={loading}
            />
            {formErrors.password && <p className="error-text">{formErrors.password}</p>}
          </div>

          <div className="form-group-row">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || isSubmitting}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="social-login-buttons">
            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleLogin}
              disabled={loading || isSubmitting}
            >
              <img src="/assets/images/google-icon.svg" alt="Google" />
              Sign in with Google
            </button>

            <button
              type="button"
              className="facebook-login-button"
              onClick={handleFacebookLogin}
              disabled={loading || isSubmitting}
            >
              <img src="/assets/images/facebook-icon.svg" alt="Facebook" />
              Sign in with Facebook
            </button>
          </div>
        </form>

        <div className="login-form-footer">
          <p>
            Don't have an account? <Link to="/register" className="register-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;