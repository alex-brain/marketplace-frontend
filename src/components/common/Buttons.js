import React from 'react';
import { Link } from 'react-router-dom';
// import './Button.css';

const Button = ({
                  children,
                  type = 'button',
                  variant = 'primary',
                  size = 'medium',
                  to,
                  href,
                  onClick,
                  loading = false,
                  disabled = false,
                  fullWidth = false,
                  icon,
                  className = '',
                  ...props
                }) => {
  const buttonClasses = `
    button 
    button-${variant} 
    button-${size} 
    ${fullWidth ? 'button-full-width' : ''} 
    ${loading ? 'button-loading' : ''} 
    ${className}
  `;

  const content = (
    <>
      {loading && <span className="button-spinner"></span>}
      {icon && !loading && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
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