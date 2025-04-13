import React from 'react';
import './Rating.css';

const Rating = ({
                  value,
                  max = 5,
                  onChange,
                  readOnly = false,
                  size = 'medium',
                  showText = true,
                  className = '',
                }) => {
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (e, rating) => {
    if (readOnly) return;

    const stars = e.currentTarget.parentNode.querySelectorAll('.star');

    stars.forEach((star, index) => {
      if (index + 1 <= rating) {
        star.classList.add('hover');
      } else {
        star.classList.remove('hover');
      }
    });
  };

  const handleMouseLeave = (e) => {
    if (readOnly) return;

    const stars = e.currentTarget.parentNode.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('hover'));
  };

  return (
    <div className={`rating rating-${size} ${className}`}>
      <div className="stars">
        {stars.map((rating) => (
          <span
            key={rating}
            className={`star ${rating <= value ? 'filled' : ''} ${readOnly ? 'readonly' : ''}`}
            onClick={() => handleClick(rating)}
            onMouseEnter={(e) => handleMouseEnter(e, rating)}
            onMouseLeave={handleMouseLeave}
            role={!readOnly ? 'button' : undefined}
            tabIndex={!readOnly ? 0 : undefined}
          >
            <i className="fas fa-star"></i>
          </span>
        ))}
      </div>

      {showText && (
        <span className="rating-text">
          {value.toFixed(1)} из {max}
        </span>
      )}
    </div>
  );
};

export default Rating;