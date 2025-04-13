/**
 * Сохранение токена аутентификации в localStorage
 * @param {string} token - JWT токен для аутентификации
 */
export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Получение текущего токена аутентификации из localStorage
 * @returns {string|null} JWT токен или null, если пользователь не авторизован
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Удаление токена аутентификации из localStorage (выход из системы)
 */
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Сохранение данных пользователя в localStorage
 * @param {Object} userData - Объект с данными пользователя
 */
export const setUserData = (userData) => {
  if (!userData) {
    return;
  }
  // Преобразуем объект в строку JSON перед сохранением
  localStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Получение данных пользователя из localStorage
 * @returns {Object|null} Объект с данными пользователя или null
 */
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  // Если данных нет, возвращаем null
  if (!userData) {
    return null;
  }

  try {
    // Преобразуем JSON-строку обратно в объект JavaScript
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // В случае ошибки парсинга (поврежденные данные), удаляем их
    removeUserData();
    return null;
  }
};

/**
 * Удаление данных пользователя из localStorage
 */
export const removeUserData = () => {
  localStorage.removeItem('user_data');
};

/**
 * Проверка, аутентифицирован ли пользователь
 * @returns {boolean} true если пользователь аутентифицирован
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getUserData();
};

/**
 * Полный сброс данных аутентификации (очистка всех связанных данных при выходе)
 */
export const clearAuthData = () => {
  removeToken();
  removeUserData();
  // Можно добавить очистку других данных, специфичных для аутентификации
  localStorage.removeItem('cart_id');
  localStorage.removeItem('recent_products');
};

/**
 * Сохранение настроек пользователя в localStorage
 * @param {Object} settings - Объект с настройками пользователя
 */
export const setUserSettings = (settings) => {
  localStorage.setItem('user_settings', JSON.stringify(settings));
};

/**
 * Получение настроек пользователя из localStorage
 * @returns {Object} Объект с настройками пользователя
 */
export const getUserSettings = () => {
  const settings = localStorage.getItem('user_settings');
  return settings ? JSON.parse(settings) : {};
};

/**
 * Сохранение ID недавно просмотренных товаров
 * @param {Array} productIds - Массив ID товаров
 */
export const setRecentProducts = (productIds) => {
  localStorage.setItem('recent_products', JSON.stringify(productIds));
};

/**
 * Получение ID недавно просмотренных товаров
 * @returns {Array} Массив ID товаров
 */
export const getRecentProducts = () => {
  const products = localStorage.getItem('recent_products');
  return products ? JSON.parse(products) : [];
};

/**
 * Добавление товара в список недавно просмотренных
 * @param {string} productId - ID товара
 * @param {number} maxItems - Максимальное количество хранимых товаров
 */
export const addToRecentProducts = (productId, maxItems = 10) => {
  let recentProducts = getRecentProducts();

  // Удаляем товар, если он уже есть в списке (чтобы переместить его в начало)
  recentProducts = recentProducts.filter(id => id !== productId);

  // Добавляем товар в начало списка
  recentProducts.unshift(productId);

  // Ограничиваем размер списка
  if (recentProducts.length > maxItems) {
    recentProducts = recentProducts.slice(0, maxItems);
  }

  setRecentProducts(recentProducts);
};

/**
 * Сохранение темы интерфейса (светлая/темная)
 * @param {string} theme - Название темы ('light' или 'dark')
 */
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

/**
 * Получение текущей темы интерфейса
 * @returns {string} Название темы ('light' или 'dark')
 */
export const getTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

/**
 * Сохранение временного ID корзины для неавторизованных пользователей
 * @param {string} cartId - ID корзины
 */
export const setCartId = (cartId) => {
  localStorage.setItem('cart_id', cartId);
};

/**
 * Получение временного ID корзины
 * @returns {string|null} ID корзины или null
 */
export const getCartId = () => {
  return localStorage.getItem('cart_id');
};

/**
 * Удаление временного ID корзины
 */
export const removeCartId = () => {
  localStorage.removeItem('cart_id');
};

export default {
  setToken,
  getToken,
  removeToken,
  setUserData,
  getUserData,
  removeUserData,
  isAuthenticated,
  clearAuthData,
  setUserSettings,
  getUserSettings,
  setRecentProducts,
  getRecentProducts,
  addToRecentProducts,
  setTheme,
  getTheme,
  setCartId,
  getCartId,
  removeCartId
};