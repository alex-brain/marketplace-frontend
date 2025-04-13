import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

const EmptyState = ({
                      title,
                      message,
                      icon = null,
                      actionText = null,
                      actionLink = null,
                      onActionClick = null,
                      size = 'medium'
                    }) => {
  return (
    <div className={`empty-state empty-state-${size}`}>
      {icon ? (
        <div className="empty-state-icon">{icon}</div>
      ) : (
        <div className="empty-state-icon default-icon">
          <i className="fas fa-box-open"></i>
        </div>
      )}

      <h3 className="empty-state-title">{title}</h3>

      {message && <p className="empty-state-message">{message}</p>}

      {actionText && (
        <div className="empty-state-action">
          {actionLink ? (
            <Link to={actionLink} className="empty-state-button">
              {actionText}
            </Link>
          ) : (
            <button className="empty-state-button" onClick={onActionClick}>
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;