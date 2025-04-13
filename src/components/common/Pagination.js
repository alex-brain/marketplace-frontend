import React from 'react';
import './Pagination.css';

const Pagination = ({
                      currentPage,
                      totalPages,
                      onPageChange,
                      siblingCount = 1
                    }) => {
  // Функция для создания диапазона чисел
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  // Функция для вычисления отображаемых страниц с учетом многоточия
  const getPaginationItems = () => {
    // Если страниц меньше 7, отображаем все страницы
    if (totalPages <= 7) {
      return range(1, totalPages);
    }

    // Вычисляем индексы для отображения с учетом текущей страницы и количества соседей
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Определяем, нужны ли многоточия
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Варианты отображения пагинации
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // 1 2 3 4 5 ... 10
      const leftItemCount = 5;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      // 1 ... 6 7 8 9 10
      const rightItemCount = 5;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      // 1 ... 4 5 6 ... 10
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const paginationItems = getPaginationItems();

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {paginationItems.map((item, index) => {
        if (item === '...') {
          return (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          );
        }

        return (
          <button
            key={item}
            className={`pagination-button ${currentPage === item ? 'active' : ''}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;