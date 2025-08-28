import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../State/ThemeContext'; // Adjust import path as needed

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

// Flag component with error handling
const FlagImage = ({ uri, style, theme }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <View style={[style, styles(theme).fallbackContainer]}>
        <Icon name="flag" size={moderateScale(20)} color="#999" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      onError={() => setError(true)}
    />
  );
};

const Country = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedCountry, setSelectedCountry] = useState(route.params?.currentCountry?.id || 1);
  const { theme, getColors } = useTheme();
  const colors = getColors();

  const countryData = [
    { id: 1, imageofcountry: 'https://flagcdn.com/w80/de.png', countryname: 'Germany' },
    { id: 2, imageofcountry: 'https://flagcdn.com/w80/at.png', countryname: 'Austria' },
    { id: 3, imageofcountry: 'https://flagcdn.com/w80/au.png', countryname: 'Australia' },
    { id: 4, imageofcountry: 'https://flagcdn.com/w80/be.png', countryname: 'Belgium' },
    { id: 5, imageofcountry: 'https://flagcdn.com/w80/bg.png', countryname: 'Bulgaria' },
    { id: 6, imageofcountry: 'https://flagcdn.com/w80/ch.png', countryname: 'Switzerland' },
    { id: 7, imageofcountry: 'https://flagcdn.com/w80/dk.png', countryname: 'Denmark' },
    { id: 8, imageofcountry: 'https://flagcdn.com/w80/es.png', countryname: 'Spain' },
    { id: 9, imageofcountry: 'https://flagcdn.com/w80/ie.png', countryname: 'Ireland' },
    { id: 10, imageofcountry: 'https://flagcdn.com/w80/it.png', countryname: 'Italy' },
    { id: 11, imageofcountry: 'https://flagcdn.com/w80/lu.png', countryname: 'Luxembourg' },
    { id: 12, imageofcountry: 'https://flagcdn.com/w80/nl.png', countryname: 'Netherlands' },
    { id: 13, imageofcountry: 'https://flagcdn.com/w80/pl.png', countryname: 'Poland' },
    { id: 14, imageofcountry: 'https://flagcdn.com/w80/sk.png', countryname: 'Slovakia' },
    { id: 15, imageofcountry: 'https://flagcdn.com/w80/gb.png', countryname: 'United Kingdom' },
  ];

  const handleCountrySelect = (item) => {
    setSelectedCountry(item.id);
    // navigation.navigate('TabNavigation', { selectedCountry: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCountrySelect(item)}>
      <View style={styles(theme).itemContainer}>
        <FlagImage 
          uri={item.imageofcountry} 
          style={[
            styles(theme).flagImage,
            selectedCountry === item.id && styles(theme).selectedFlag,
          ]}
          theme={theme}
        />
        <Text style={styles(theme).countryName}>{item.countryname}</Text>
        {selectedCountry === item.id && (
          <Icon name="checkmark" size={25} color="red" style={styles(theme).checkIcon} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="red" />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Select country</Text>
      </View>
      <View style={styles(theme).divider} />

      <FlatList
        style={{ paddingBottom: 20 }}
        data={countryData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles(theme).separator} />}
      />
    </View>
  );
};

// Dynamic styles based on theme
const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'DARK' ? '#121212' : '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  paddingVertical:8
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginLeft: 20,
    fontFamily: 'poppins-Medium',
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
    marginHorizontal: -20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme === 'DARK' ? '#121212' : '#FFFFFF',
  },
  flagImage: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: 20,
    resizeMode: 'cover',
    backgroundColor: theme === 'DARK' ? '#333333' : '#f8f8f8',
    borderWidth: 0.5,
    borderColor: theme === 'DARK' ? '#444444' : '#E0E0E0',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme === 'DARK' ? '#444444' : '#E0E0E0',
    backgroundColor: theme === 'DARK' ? '#333333' : '#f8f8f8',
  },
  selectedFlag: {
    // Add any specific styles for selected flag if needed
  },
  countryName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginLeft: 20,
    fontFamily: 'poppins-Medium',
    flex: 1,
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
  },
  checkIcon: {
    marginRight: "5%"
  },
  separator: {
    height: 1,
    backgroundColor: theme === 'DARK' ? '#333333' : '#f0f0f0',
    marginHorizontal: 20,
  },
});

export default Country;