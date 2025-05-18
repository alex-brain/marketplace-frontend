import React from 'react';
import { Link } from 'react-router-dom';
import './Buttons.css';

const Button = ({
                  children,
                  type = 'button',
                  variant = 'primary',
                  size = 'medium',
                  to=null,
                  href=null,
                  onClick,
                  loading = false,
                  disabled = false,
                  fullWidth = false,
                  icon=null,
                  className = '',
                  ...props
                }) => {
  const buttonClasses = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${fullWidth ? 'btn-full-width' : ''} 
    ${loading ? 'btn-loading' : ''} 
    ${icon ? 'btn-icon' : ''}
    ${className}
  `;

  const content = (
    <>
      {loading && <span className="spinner"></span>}
      {icon && !loading && <i className={icon}></i>}
      {children}
    </>
  );

  // Если передан параметр to, то рендерим компонент Link из react-router-dom
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {content}
      </Link>
    );
  }

  // Если передан параметр href, то рендерим обычный тег a
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {content}
      </a>
    );
  }

  // В остальных случаях рендерим кнопку
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;