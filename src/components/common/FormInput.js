import React from 'react';
import './FormInput.css';

const FormInput = ({
                     label,
                     name,
                     value,
                     onChange,
                     type = 'text',
                     placeholder = '',
                     required = false,
                     disabled = false,
                     error = null,
                     helperText = null,
                     fullWidth = false,
                     icon = null,
                     options = [], // для select
                     multiple = false, // для select
                     rows = 3, // для textarea
                     min, max, step, // для number
                     pattern, // для text с паттерном
                     className = '',
                     ...props
                   }) => {
  const inputClasses = `
    form-input 
    ${error ? 'has-error' : ''} 
    ${disabled ? 'disabled' : ''} 
    ${fullWidth ? 'full-width' : ''} 
    ${icon ? 'has-icon' : ''}
    ${className}
  `;

  const renderInputElement = () => {
    // Для текстового поля
    if (type === 'text' || type === 'email' || type === 'password' || type === 'number' || type === 'tel' || type === 'url' || type === 'search') {
      return (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          {...props}
        />
      );
    }

    // Для многострочного текстового поля
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          {...props}
        />
      );
    }

    // Для выпадающего списка
    if (type === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          multiple={multiple}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Для чекбокса
    if (type === 'checkbox') {
      return (
        <div className="checkbox-wrapper">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            {...props}
          />
          <label htmlFor={name} className="checkbox-label">
            {label}
          </label>
        </div>
      );
    }

    // Для радио-кнопки
    if (type === 'radio') {
      return (
        <div className="radio-group">
          {options.map((option) => (
            <div key={option.value} className="radio-wrapper">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                {...props}
              />
              <label htmlFor={`${name}-${option.value}`} className="radio-label">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
    }

    // Для даты
    if (type === 'date' || type === 'time' || type === 'datetime-local') {
      return (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          {...props}
        />
      );
    }

    // По умолчанию возвращаем текстовое поле
    return (
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...props}
      />
    );
  };

  // Пропускаем рендер лейбла для чекбокса и радио
  const renderLabel = () => {
    if (type === 'checkbox') return null;

    return (
      <label htmlFor={name} className={required ? 'required' : ''}>
        {label}
      </label>
    );
  };

  return (
    <div className={inputClasses}>
      {renderLabel()}

      <div className="input-container">
        {icon && <div className="input-icon">{icon}</div>}
        {renderInputElement()}
      </div>

      {(error || helperText) && (
        <div className={`input-message ${error ? 'error-message' : 'helper-text'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default FormInput;