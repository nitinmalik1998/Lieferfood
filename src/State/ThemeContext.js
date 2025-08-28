// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('LIGHT');

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Theme-based color mapping
  const getColors = () => {
    return theme === 'DARK' ? {
      background: '#121212',
      text: '#FFFFFF',
      border: '#333333',
      placeholder: '#9E9E9E',
      card: '#1E1E1E',
      card1: '#1E1E1E',
      icon: '#FFFFFF',
      tabicon: 'grey',
      shimmer1: '#2a2a2a',
      shimmer2: '#333333',
      shimmer3: '#2a2a2a',
      toggleActive: '#333333',
      toggleInactive: '#333333',
      heartBackground: 'rgba(200,200,200,0.4)',
      white: "white",
      headerBg: 'red',
      tabBg: '#1E1E1E',
      currentDayColor: '#4CAF50',
      linkColor: '#64B5F6',
      selectedSizeHeader: '#55b65aff',
      badgeBackground: '#F4C430',
      badgeText: '#000000',
      requiredBadgeBackground: '#FFFFFF',
      requiredBadgeText: '#000000',
      cartSummaryBg: 'red',
      cartItemBg: '#2a2a2a',
      sheetBackground: '#1E1E1E',
      divider: '#333333',
      listeningBg: '#1E1E1E',
      black:"black",
      choosebackground:"#ddd3",
      itembackground:"#ddd1",
       deliveryfree:"#1E1E1E",
       headerbg1:"white",
        border1: '#333333',
    } : {
      background: '#FFFFFF',
      text: '#000000',
      border: '#E0E0E0',
      placeholder: '#9E9E9E',
      card: '#FFFFFF',
      card1: '#ddd5',
      icon: 'grey',
      tabicon: 'grey',
      shimmer1: '#ebebeb',
      shimmer2: '#c5c5c5',
      shimmer3: '#ebebeb',
      toggleActive: '#D3D3D3',
      toggleInactive: '#D3D3D3',
      heartBackground: 'rgba(52,52,52,0.4)',
      white: "white",
      headerBg: 'red',
      tabBg: 'lightgrey',
      currentDayColor: 'green',
      linkColor: 'blue',
      selectedSizeHeader: '#55b65aff',
      badgeBackground: '#F4C430',
      badgeText: '#FFFFFF',
      requiredBadgeBackground: '#000000',
      requiredBadgeText: '#FFFFFF',
      cartSummaryBg: 'red',
      cartItemBg: '#f0f0f0',
      sheetBackground: '#FFFFFF',
      divider: '#E0E0E0',
      listeningBg: '#f9f9f9',
      black:"black",
      choosebackground:"#ddd3",
      itembackground:"#ddd4",
  deliveryfree:"#f5f5f5",
  headerbg1:"grey",
   border1: '#f5f5f5',
    };
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);