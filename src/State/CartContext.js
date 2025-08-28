import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (item, size, options, qty) => {
    // If called with complete cart item structure (from Cart screen)
    if (typeof size === 'undefined' && typeof options === 'undefined' && typeof qty === 'undefined') {
      setCartItems(prev => [...prev, item]);
      return;
    }

    // Regular item processing (from menu screen)
    const newItem = {
      id: `${item.id}-${Date.now()}`, // unique id for each cart item
      name: item.dishname,
      size,
      options,
      quantity: qty,
      basePrice: parseFloat(
        item[`discount${size}`]
          .replace('€', '')
          .replace(',', '.')
          .trim()
      ),
      optionsTotal: options.reduce(
        (sum, opt) => 
          sum + parseFloat(opt.price.replace('+', '').replace('€', '').replace(',', '.').trim()),
        0
      ),
      originalItem: item, // Store original menu item for editing
      note: '', // Initialize note
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? {...item, quantity: newQuantity} : item
      )
    );
  };

  const updateNote = (itemId, note) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? {...item, note} : item
      )
    );
  };

  const updateCartItem = (itemId, updatedItem) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? updatedItem : item
      )
    );
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Calculate price per item (with discount if applicable)
      let itemPrice = item.basePrice + item.optionsTotal;
      if (item.discount?.label === "Special Offer") {
        itemPrice = itemPrice * (1 - item.discount.percentage / 100);
      }
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // NEW: Calculate delivery fee based on cart total
  const calculateDeliveryFee = (subtotal) => {
    return subtotal < 50 ? 2 : 0;
  };

  const totalItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateNote,
      updateCartItem,
      calculateCartTotal,
      calculateDeliveryFee, // NEW: Added delivery fee calculation
      totalItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);