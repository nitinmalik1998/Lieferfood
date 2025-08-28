// Filter.js
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../State/ThemeContext'; // Adjust path as needed

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

const Filter = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { getColors } = useTheme();
  const colors = getColors();
  
  const [selectedSortId, setSelectedSortId] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [placesCount, setPlacesCount] = useState(16);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const data = [
    { id: 1, title1: 'Deals', title2: '15' },
    { id: 2, title1: 'Free Delivery', title2: '19' },
    { id: 3, title1: 'StampCards', title2: '28' },
    { id: 4, title1: 'Open Now', title2: '46' },
    { id: 5, title1: 'New', title2: '11' },
    { id: 6, title1: 'Halal', title2: '13' },
  ];

  const data1 = [
    { id: 1, title: 'Best match' },
    { id: 2, title: 'Customer rating' },
    { id: 3, title: 'Distance' },
    { id: 4, title: 'Minimum order' },
    { id: 5, title: 'Delivery fee' },
    { id: 6, title: 'Best match' },
    { id: 7, title: 'Customer rating' },
    { id: 8, title: 'Distance' },
    { id: 9, title: 'Minimum order' },
    { id: 10, title: 'Delivery fee' },
  ];
 
  const handleFilterPress = (item) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id];
      
      // Calculate new count
      const newCount = data.reduce((acc, curr) => 
        newFilters.includes(curr.id) ? acc + parseInt(curr.title2) : acc, 0
      );
      setPlacesCount(16 + newCount);
      
      return newFilters;
    });
  };

  const handleReset = () => {
    setSelectedFilters([]);
    setPlacesCount(61);
  };

  const handleRadioPress = (itemId) => {
    setSelectedSortId(prevId => prevId === itemId ? null : itemId);
  };

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom 
    }]}>
      <View style={styles.viewtop}>
        <TouchableOpacity onPress={() => navigation.navigate('TabNavigation')}>
          <Icon name="arrowleft" size={28} color="red" />
        </TouchableOpacity>
        <Text style={styles.refinetext}>Refine results</Text>
        <TouchableOpacity onPress={handleReset} >
          <Text style={styles.resettext}>RESET</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lineview}></View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.filtertext}>Filters</Text>
        <FlatList
          style={{marginTop: 5}}
          data={data}
          renderItem={({item}) => {
            const isSelected = selectedFilters.includes(item.id);
            return (
              <TouchableOpacity
                onPress={() => handleFilterPress(item)}
                style={[
                  styles.filterItem, 
                  { borderColor: colors.border }
                ]}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[
                    styles.filtersdetailtext,
                    { color: isSelected ? 'green' : colors.text }
                  ]}>
                    {item.title1}
                  </Text>
                  {isSelected && (
                    <Icon name="check" size={16} color="green" style={{marginLeft: 10}} />
                  )}
                </View>
                
                {!isSelected && (
                  <Text style={[styles.filtersdetailtext, { color: colors.text }]}>
                    {item.title2}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
        <Text style={styles.filtertext}>Sort by</Text>
        <FlatList
          style={{marginTop: 5, marginBottom: 15}}
          data={data1}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleRadioPress(item.id)}
              style={[
                styles.radioButtonContainer, 
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border 
                }
              ]}
            >
              <Text style={[styles.filtersdetailtext, { color: colors.text }]}>
                {item.title}
              </Text>
              <View style={[
                styles.radioButton,
                { borderColor: colors.border },
                selectedSortId === item.id && styles.radioButtonSelected
              ]}>
                {selectedSortId === item.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      <View style={styles.lineviewbottom}></View>
      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.textbutton}>View {placesCount} Places</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal:10
  },
  scrollView: {
    backgroundColor: colors.background,
  },
  viewtop: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: 'center'
  },
  lineview: {
    borderWidth: 0.2,
    borderColor: colors.border,
    marginTop: 20,
    marginHorizontal: -10,
  },
  refinetext: {
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    color: colors.text,
  },
  resettext: {
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginRight: 10,
    color: 'red',
  },
  filtertext: {
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginTop: 15,
    color: colors.text,
  },
  filtersdetailtext: {
    fontFamily: 'Poppins-Regular',
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.card,
  },
  lineviewbottom: {
    borderWidth: 0.2,
    borderColor: colors.border,
    marginHorizontal: -10,
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 30,
    marginHorizontal: 30,
    bottom: 30,
  },
  textbutton: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: 'Poppins-Medium',
    borderRadius: 40,
    fontWeight: '700',
    fontSize: moderateScale(20),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: 'red',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});

export default Filter;