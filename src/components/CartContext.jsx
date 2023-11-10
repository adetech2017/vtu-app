import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// Create a context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevCartItems) => [...prevCartItems, product]);
  };

  const removeFromCart = (productId, productName) => {
    try {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.id !== productId)
      );
      toast.success(`Product removed from the cart successfully!`);
    } catch (error) {
      toast.error(`Error removing item from the cart: ${error.message}`);
    }
  };

  // Provide the cart state and functions to children components
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
