import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../State/ThemeContext'; // Adjust import path as needed

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

// Flag component with error handling
const FlagImage = ({uri, style, theme}) => {
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
      source={{uri}}
      style={style}
      onError={() => setError(true)}
    />
  );
};

const Language = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(1);
  const {theme, getColors} = useTheme();
  const colors = getColors();

  // Updated flag URLs with higher resolution
  const languageData = [
    {
      id: 1,
      title: 'Deutsch',
      subtitle: 'Deutschland',
      flag: 'https://flagcdn.com/w320/de.png',
    },
    {
      id: 2,
      title: 'dansk',
      subtitle: 'Danmark',
      flag: 'https://flagcdn.com/w320/dk.png',
    },
    {
      id: 3,
      title: 'Deutsch',
      subtitle: 'Belgian',
      flag: 'https://flagcdn.com/w320/be.png',
    },
    {
      id: 4,
      title: 'Deutsch',
      subtitle: 'Luxemburg',
      flag: 'https://flagcdn.com/w320/lu.png',
    },
    {
      id: 5,
      title: 'Deutsch',
      subtitle: 'Schweiz',
      flag: 'https://flagcdn.com/w320/ch.png',
    },
    {
      id: 6,
      title: 'English',
      subtitle: 'Australia',
      flag: 'https://flagcdn.com/w320/au.png',
    },
    {
      id: 7,
      title: 'English',
      subtitle: 'United Kingdom',
      flag: 'https://flagcdn.com/w320/gb.png',
    },
    {
      id: 8,
      title: 'Polski',
      subtitle: 'Polska',
      flag: 'https://flagcdn.com/w320/pl.png',
    },
    {
      id: 9,
      title: 'Nederlands',
      subtitle: 'Nederland',
      flag: 'https://flagcdn.com/w320/nl.png',
    },
    {
      id: 10,
      title: 'italiano',
      subtitle: 'Italia',
      flag: 'https://flagcdn.com/w320/it.png',
    },
    {
      id: 11,
      title: 'italiano',
      subtitle: 'Svizzera',
      flag: 'https://flagcdn.com/w320/ch.png',
    },
    {
      id: 12,
      title: 'francais',
      subtitle: 'France',
      flag: 'https://flagcdn.com/w320/fr.png',
    },
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => setSelectedLanguage(item.id)}>
      <View style={styles(theme).itemContainer}>
        <FlagImage 
          uri={item.flag} 
          style={styles(theme).flagImage} 
          theme={theme}
        />
        <View style={styles(theme).textContainer}>
          <Text style={styles(theme).titleText}>{item.title}</Text>
          <Text style={styles(theme).subtitleText}>{item.subtitle}</Text>
        </View>
        <View style={styles(theme).radioContainer}>
          {selectedLanguage === item.id ? (
            <Icon name="radio-button-on" size={24} color="red" />
          ) : (
            <Icon 
              name="radio-button-off" 
              size={24} 
              color={colors.placeholder} 
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles(theme).container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="red" />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Language</Text>
      </View>
      <View style={styles(theme).divider} />

      <FlatList
        style={{paddingBottom: 10}}
        data={languageData}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme === 'DARK' ? '#121212' : '#FFFFFF',
  },
  flagImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: 20,
    marginRight: moderateScale(15),
    resizeMode: 'cover',
    backgroundColor: theme === 'DARK' ? '#333333' : '#f8f8f8',
    borderWidth: 0.5,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
    backgroundColor: theme === 'DARK' ? '#333333' : '#f8f8f8',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: 'poppins-Medium',
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
  },
  subtitleText: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    fontFamily: 'poppins-Medium',
    color: theme === 'DARK' ? '#AAAAAA' : '#666666',
    marginTop: 2,
  },
  radioContainer: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: theme === 'DARK' ? '#333333' : '#f0f0f0',
    marginHorizontal: 20,
  },
});

export default Language;

