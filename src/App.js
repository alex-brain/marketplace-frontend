import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import { checkAuth } from './redux/actions/authActions';

// Компоненты общего назначения
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Публичные страницы
import Home from './components/pages/Home';
// import ProductDetail from './components/products/ProductDetail';
import Login from './components/pages/LoginPage';
import Register from './components/pages/RegisterPage';
import store from "./redux/store";

// Страницы для авторизованных пользователей
// import Cart from './components/cart/Cart';
// import Checkout from './components/orders/Checkout';
// import OrderConfirmation from './components/orders/OrderConfirmation';
// import OrderHistory from './components/orders/OrderHistory';
// import Profile from './components/user/Profile';

// Страницы администратора (продавца)
// import Dashboard from './components/admin/Dashboard';
// import ProductManagement from './components/admin/ProductManagement';
// import CategoryManagement from './components/admin/CategoryManagement';
// import OrderManagement from './components/admin/OrderManagement';

// PrivateRoute - компонент для защищенных маршрутов
const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Если требуется определенная роль и у пользователя ее нет, перенаправляем на главную
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  /*if (loading) {
    return <div className="app-loading">Загрузка...</div>;
  }*/

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            {/*<Route path="/products/:id" element={<ProductDetail />} />*/}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Маршруты для авторизованных пользователей */}
            {/*<Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <PrivateRoute>
                  <OrderConfirmation />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />*/}

            {/* Маршруты для администратора (продавца) */}
            {/*<Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="seller">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <PrivateRoute requiredRole="seller">
                  <ProductManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <PrivateRoute requiredRole="seller">
                  <CategoryManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PrivateRoute requiredRole="seller">
                  <OrderManagement />
                </PrivateRoute>
              }
            />*/}

            {/* Маршрут по умолчанию - перенаправление на главную страницу */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;