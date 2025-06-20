import React, { useState, useEffect } from 'react';
// import './ImageGallery.css';

const ImageGallery = ({
                        images = [],
                        defaultImage = null,
                        thumbnailPosition = 'bottom'  // 'bottom' или 'left'
                      }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Если передано только defaultImage без массива
  useEffect(() => {
    if (images.length === 0 && defaultImage) {
      images = [{ src: defaultImage, alt: 'Product Image' }];
    }
  }, [images, defaultImage]);

  // Обработчик клавиш для навигации по галерее
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev < images.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : prev
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, images.length]);

  // Проверка, что есть изображения для отображения
  if (!images.length && !defaultImage) {
    return (
      <div className="image-gallery-placeholder">
        <i className="fas fa-image"></i>
        <p>Нет изображений</p>
      </div>
    );
  }

  // Массив изображений для отображения
  const displayImages = images.length > 0
    ? images
    : [{ src: defaultImage, alt: 'Product Image' }];

  // Обработчики для навигации
  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev < displayImages.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev > 0 ? prev - 1 : 0
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Определяем классы для контейнера
  const containerClasses = [
    'image-gallery',
    displayImages.length <= 1 ? 'single-image' : '',
    thumbnailPosition === 'left' ? 'gallery-horizontal' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="gallery-main">
        <div
          className={`gallery-image-container ${isFullscreen ? 'fullscreen' : ''}`}
          onClick={toggleFullscreen}
        >
          <img
            src={`http://localhost:5000${displayImages[selectedIndex].src}`}
            alt={displayImages[selectedIndex].alt || 'Image'}
            className="gallery-image"
            /*onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.png';
            }}*/
          />

          {/* Управление в fullscreen режиме */}
          {isFullscreen && (
            <>
              <button className="gallery-control close-btn" onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}>
                <i className="fas fa-times"></i>
              </button>

              {displayImages.length > 1 && selectedIndex > 0 && (
                <button
                  className="gallery-control prev-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}

              {displayImages.length > 1 && selectedIndex < displayImages.length - 1 && (
                <button
                  className="gallery-control next-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}

              {displayImages.length > 1 && (
                <div className="gallery-indicator">
                  {selectedIndex + 1} / {displayImages.length}
                </div>
              )}
            </>
          )}

          {/* Управление в обычном режиме - только для множественных изображений */}
          {!isFullscreen && displayImages.length > 1 && (
            <>
              {selectedIndex > 0 && (
                <button
                  className="gallery-control prev-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}

              {selectedIndex < displayImages.length - 1 && (
                <button
                  className="gallery-control next-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </>
          )}

          {/* Кнопка увеличения - показываем всегда в обычном режиме */}
          {!isFullscreen && (
            <button
              className="gallery-control zoom-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              <i className="fas fa-search-plus"></i>
            </button>
          )}
        </div>
      </div>

      {/* Миниатюры - показываем только если изображений больше одного */}
      {displayImages.length > 1 && (
        <div className="gallery-thumbnails">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`gallery-thumbnail ${selectedIndex === index ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.png';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;