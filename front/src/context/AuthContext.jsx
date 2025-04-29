import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  });

  // Obtener usuario autenticado
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get('/auth/user/');
      setUser(res.data);
    } catch (err) {
      console.error('[AUTH] Usuario no autenticado:', err.response?.data || err);
      logout(); // Limpiar si token ya no es válido
    }
  }, []);

  // Verificar sesión al montar el proveedor
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      fetchUser();
    }
  }, [accessToken, fetchUser]);

  // Login
  const login = async ({ username, password }) => {
    try {
      const res = await axios.post('/auth/token/', { username, password });
      const { access } = res.data;

      // Guardar token
      localStorage.setItem('accessToken', access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setAccessToken(access);

      await fetchUser();
      return { success: true };
    } catch (err) {
      console.error('[AUTH] Error al iniciar sesión:', err.response?.data || err);
      return { success: false, message: err.response?.data?.detail || 'Error desconocido' };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
