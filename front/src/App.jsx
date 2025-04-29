import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Cart from './components/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PublicRoute from './routes/PublicRoute';
import ProductsPage from './pages/ProductsPage';
import Orders from './pages/Orders';
import CategoriesPage from './components/CategoriesPage';
import WishlistPage from './pages/WishlistPage';


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:id" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Rutas públicas protegidas si ya está logueado */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
      </Routes>
    </>
  );
};

export default App;
