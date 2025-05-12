import React, { useState, useEffect } from 'react';
// import './Alert.css';

const Alert = ({
                 type = 'info',
                 message,
                 onClose,
                 autoClose = true,
                 autoCloseTime = 5000
               }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, message, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!message || !visible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
        {type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
        {type === 'info' && <i className="fas fa-info-circle"></i>}
      </div>
      <div className="alert-content">{message}</div>
      <button className="alert-close" onClick={handleClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Alert;