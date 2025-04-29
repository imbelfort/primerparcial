/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useCallback, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing cart data:', error);
      return [];
    }
  });

  // Persistencia en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  }, [cartItems]);

  // Memoización de valores calculados
  const { cartTotal, itemCount, totalItems } = useMemo(() => {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const itemCount = cartItems.length;

    return { cartTotal, itemCount, totalItems };
  }, [cartItems]);

  // Funciones memoizadas para mejor rendimiento
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, product.stock || Infinity)
            }
            : item
        );
      }
      return [...prev, {
        ...product,
        price: parseFloat(product.price), // ✅ Asegura que sea número
        quantity: Math.min(quantity, product.stock || Infinity),
        addedAt: new Date().toISOString()
      }];

    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const quantity = Math.max(1, newQuantity);
          // Verificar stock máximo si está disponible
          const maxQuantity = item.stock ? Math.min(quantity, item.stock) : quantity;
          return { ...item, quantity: maxQuantity };
        }
        return item;
      })
    );
  }, []);

  const increaseQuantity = useCallback((id) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + 1;
          // Verificar stock máximo si está disponible
          const maxQuantity = item.stock ? Math.min(newQuantity, item.stock) : newQuantity;
          return { ...item, quantity: maxQuantity };
        }
        return item;
      })
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const isInCart = useCallback((id) => {
    return cartItems.some(item => item.id === id);
  }, [cartItems]);

  // Ordenar items por fecha de agregado (más reciente primero)
  const sortedCartItems = useMemo(() => {
    return [...cartItems].sort((a, b) =>
      new Date(b.addedAt || 0) - new Date(a.addedAt || 0)
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems: sortedCartItems,
        cartTotal,
        itemCount,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};