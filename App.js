import React from 'react';
import { ThemeProvider } from './src/State/ThemeContext';
import { CartProvider } from './src/State/CartContext';
import StackNavigation from './src/Navigation/RootNavigation';

const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <StackNavigation />
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;