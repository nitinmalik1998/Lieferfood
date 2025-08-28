import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../State/ThemeContext';
import { Home } from '../Screens/Home';
import Account from '../Screens/Account';
import Cart from '../Screens/Cart';
import Location from '../Screens/Location';

const TabNavigation = () => {
  const TabNav = createBottomTabNavigator();
  const insets = useSafeAreaInsets();
  const { getColors } = useTheme();
  const colors = getColors();

  // Dynamic height calculation
  const TAB_BAR_BASE_HEIGHT = 56;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  return (
    <TabNav.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          paddingTop: 0,
          fontFamily: "Poppins-Medium"
        },
        tabBarStyle: {
          height: tabBarHeight,
          backgroundColor: colors.card,
          paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 8,
          paddingTop: 0,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <TabNav.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home-sharp"
              size={26}
              color={focused ? 'red' : colors.tabicon}
            />
          ),
        }}
      />
      <TabNav.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon1
              name="shopping-cart"
              size={26}
              color={focused ? 'red' : colors.tabicon}
            />
          ),
        }}
      />
      <TabNav.Screen
        name="Location"
        component={Location}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="location-sharp"
              size={26}
              color={focused ? 'red' : colors.tabicon}
            />
          ),
        }}
      />
      <TabNav.Screen
        name="Profile"
        component={Account}
        initialParams={{ selectedCountry: null }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon2
              name="account"
              size={30}
              color={focused ? 'red' : colors.tabicon}
            />
          ),
        }}
      />
    </TabNav.Navigator>
  );
};

export default TabNavigation;