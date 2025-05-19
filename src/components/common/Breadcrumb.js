import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Breadcrumb.css';

const Breadcrumb = ({ items, separator = '/', homeIcon = '🏠', showHome = true }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {showHome && (
          <li className="breadcrumb-item">
            <Link to="/" className="breadcrumb-link home-link">
              {homeIcon} Главная
            </Link>
          </li>
        )}
        
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
          >
            {index > 0 || showHome ? <span className="separator">{separator}</span> : null}
            
            {index === items.length - 1 ? (
              <span className="current-page" aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.path} className="breadcrumb-link">{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ).isRequired,
  separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  homeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showHome: PropTypes.bool
};

export default Breadcrumb;