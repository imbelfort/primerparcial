import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, Heart } from 'lucide-react';


const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      await logout();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
            aria-label="Inicio"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src="/src/assets/logo.svg" alt="Ecommers Logo" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['/products', '/categories'].map((path) => (
              <Link 
                key={path} 
                to={path} 
                className={`hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 
                  ${location.pathname === path ? 'text-emerald-600 border-b-2 border-emerald-600' : ''}
                `}
              >
                {path === '/products' ? 'Productos' : 'Categorías'}
              </Link>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/wishlist" 
              className="relative hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
              aria-label="Lista de deseos"
            >
              <Heart size={22} />
            </Link>
            
            <Link 
              to="/cart" 
              className="relative hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
              aria-label="Lista de compras"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <button 
                  className="flex items-center gap-2 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
                  aria-label="Menú de usuario"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User size={22} />
                  <span className="hidden lg:inline">{user?.username}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    {['/profile', '/orders'].map((path, index) => (
                      <Link 
                        key={index} 
                        to={path} 
                        className="block px-4 py-2 hover:bg-emerald-50 focus:bg-emerald-50 outline-none transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {path === '/profile' ? 'Mi perfil' : 'Mis pedidos'}
                      </Link>
                    ))}
                    <button 
                      onClick={handleLogout} 
                      disabled={isLoading}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 outline-none flex items-center transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></span>
                      ) : (
                        <LogOut size={16} className="inline mr-2" />
                      )}
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-3 py-1"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              to="/wishlist" 
              className="relative hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
              aria-label="Lista de deseos"
            >
              <Heart size={22} />
            </Link>
            <Link 
              to="/cart" 
              className="relative hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
              aria-label="Lista de compras"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 shadow-lg">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {['/products', '/categories', '/deals'].map((path) => (
              <Link 
                key={path} 
                to={path} 
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2
                  ${location.pathname === path ? 'text-emerald-600 border-b-2 border-emerald-600' : ''}
                `}
              >
                {path === '/products' ? 'Productos' : path === '/categories' ? 'Categorías' : 'Ofertas'}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="font-medium pt-3 border-t">Hola, {user?.username}</div>
                {['/profile', '/orders'].map((path, index) => (
                  <Link 
                    key={index} 
                    to={path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
                  >
                    {path === '/profile' ? 'Mi perfil' : 'Mis pedidos'}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-left py-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 flex items-center transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : (
                    <LogOut size={16} className="mr-2" />
                  )}
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 text-emerald-600 hover:text-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
