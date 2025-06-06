import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import { checkAuth } from './redux/actions/authActions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setAuthToken } from './utils/setAuthToken';

// Компоненты общего назначения
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Публичные страницы
import Home from './components/pages/Home';

import ProductDetail from './components/products/ProductDetail';
import Login from './components/pages/LoginPage';
import Register from './components/pages/RegisterPage';
import store from "./redux/store";
import About from "./components/common/About"; 

// Страницы для авторизованных пользователей
import Cart from './components/pages/Cart';
// import Checkout from './components/orders/Checkout';
// import OrderConfirmation from './components/orders/OrderConfirmation';
// import OrderHistory from './components/orders/OrderHistory';
// import Profile from './components/user/Profile';
import ProfileScreen from './components/pages/ProfileScreen';
import OrdersScreen from './components/pages/OrdersScreen';


// Страницы администратора (продавца)
import AdminLogin from './components/admin/adminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/orderManagement';
import AdminRoute from './AdminRoute';
import Checkout from "./components/orders/Checkout";
import CategoryManagement from "./components/admin/CategoryManagement";
import CategoryProducts from "./components/pages/CategoryProducts";
import SearchProducts from "./components/pages/SearchProducts";
import ScrollToTop from './components/common/ScrollToTop';
//import CategoryManagement from './components/admin/CategoryManagement';

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
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  console.log('App', )
  
  useEffect(() => {
    console.log('render App')
  }, [])

  /*if (loading) {
    return <div className="app-loading">Загрузка...</div>;
  }*/

  return (
    <Router>
      <ScrollToTop/>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchProducts />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories/:id" element={<CategoryProducts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/orders" element={<OrdersScreen />} />
           <Route path="/about/*" element={<About />} />
          
 


            {/* Маршруты для авторизованных пользователей */}
            <Route
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
            {/*<Route
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
            <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="categories" element={<CategoryManagement />} />

         
          </Route>
          </Route>

            {/* Маршрут по умолчанию - перенаправление на главную страницу */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
};

export default App;