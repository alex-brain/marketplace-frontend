import React from 'react';
// import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizeClass = `loader-${size}`;

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader ${sizeClass}`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`loader ${sizeClass}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;