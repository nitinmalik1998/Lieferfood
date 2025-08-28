import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../State/ThemeContext'; // Adjust path as needed

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);


const Seeall = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { getColors } = useTheme();
  const colors = getColors();
  
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const [selectedIds, setSelectedIds] = useState([]); // Track All Categories
  const [selectedIds1, setSelectedIds1] = useState([]); // Track Popular Categories

  // Keep the original data1 and data2 arrays exactly as provided
  const data1 = [
    {
      id: 9,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: '2 for 1 Deals',
      noresturant: '23',
    },
    {
      id: 10,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'American',
      noresturant: '7',
    },
    {
      id: 11,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'American style pizza',
      noresturant: '11',
    },
    {
      id: 12,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Arab',
      noresturant: '1',
    },
    {
      id: 13,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Bowls',
      noresturant: '3',
    },
    {
      id: 14,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Breakfast',
      noresturant: '5',
    },
    {
      id: 15,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Cake',
      noresturant: '9',
    },
    {
      id: 16,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Cassrole',
      noresturant: '2',
    },
    {
      id: 17,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Chicken',
      noresturant: '17',
    },
    {
      id: 18,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Curry',
      noresturant: '22',
    },
    {
      id: 19,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Drinks/Snacks',
      noresturant: '17',
    },
    {
      id: 20,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Dumplings',
      noresturant: '10',
    },
    {
      id: 21,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Doner',
      noresturant: '3',
    },
    {
      id: 22,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Falafel',
      noresturant: '9',
    },
    {
      id: 23,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Fries',
      noresturant: '12',
    },
    {
      id: 24,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'German dishes',
      noresturant: '1',
    },
    {
      id: 25,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Greek',
      noresturant: '18',
    },
    {
      id: 26,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Gyros',
      noresturant: '12',
    },
    {
      id: 27,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Hot dog',
      noresturant: '12',
    },
    {
      id: 28,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Noodles',
      noresturant: '12',
    },
    {
      id: 29,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Poke bowl',
      noresturant: '5',
    },
    {
      id: 30,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Salads',
      noresturant: '8',
    },
    {
      id: 31,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Sandwiches',
      noresturant: '14',
    },
    {
      id: 32,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Snacks',
      noresturant: '5',
    },
    {
      id: 33,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Steaks',
      noresturant: '1',
    },
    {
      id: 34,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Sushi',
      noresturant: '4',
    },
    {
      id: 35,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Thai',
      noresturant: '6',
    },
    {
      id: 36,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Turkish',
      noresturant: '10',
    },
    {
      id: 37,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Turkish pizza',
      noresturant: '3',
    },
    {
      id: 38,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Vegan',
      noresturant: '32',
    },
    {
      id: 39,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Vegan',
      noresturant: '18',
    },
    {
      id: 40,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Vegetarian',
      noresturant: '12',
    },
    {
      id: 41,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Vietnamese',
      noresturant: '4',
    },
  ];

  const data2 = [
    {
      id: 1,
      dishimage:
        'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Itallian style pizza',
      noresturant: '10',
    },
    {
      id: 2,
      dishimage:
        'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Chinese',
      noresturant: '8',
    },
    {
      id: 3,
      dishimage:
        'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Burgers',
      noresturant: '13',
    },
    {
      id: 4,
      dishimage:
        'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Italian',
      noresturant: '15',
    },
    {
      id: 5,
      dishimage:
        'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Indian',
      noresturant: '18',
    },
    {
      id: 6,
      dishimage:
        'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: '100% Halal',
      noresturant: '8',
    },
    {
      id: 7,
      dishimage:
        'https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Asian',
      noresturant: '17',
    },
    {
      id: 8,
      dishimage:
        'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      dishname: 'Pasta',
      noresturant: '20',
    },
  ];


  // Toggle selection for Popular Categories (data2)
  const toggleSelection1 = (id) => {
    setSelectedIds1(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  // Toggle selection for All Categories (data1)
  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };
  const renderItem = ({item}) => {
    const isSelected1 = selectedIds1.includes(item.id); // Check array
    return (
      <TouchableOpacity
        onPress={() => toggleSelection1(item.id)}
        style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Image source={{uri: item.dishimage}} style={styles.image} />
          {isSelected1 && (
            <View style={styles.checkIconContainer}>
              <Icon name="check" size={18} color="white" />
            </View>
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.dishtext, 
              isSelected1 && styles.selecteddishtext,
              { color: isSelected1 ? colors.text : colors.placeholder }
            ]}>
            {item.dishname}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem1 = ({item}) => {
    const isSelected = selectedIds.includes(item.id); // Check array
    return (
      <TouchableOpacity onPress={() => toggleSelection(item.id)}>
        <View style={[
          styles.allcategoriesview,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}>
          {isSelected && (
            <Icon
              name="check"
              size={18}
              color="#00C853"
              style={styles.arrowIcon}
            />
          )}
          <Text
            style={[
              styles.categoryText, 
              { color: isSelected ? '#00C853' : colors.text }
            ]}>
            {item.dishname}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  const calculateTotal = () => {
    const data1Total = selectedIds.reduce((sum, id) => {
      const item = data1.find(d => d.id === id);
      return sum + (item ? parseInt(item.noresturant, 10) : 0);
    }, 0);

    const data2Total = selectedIds1.reduce((sum, id) => {
      const item = data2.find(d => d.id === id);
      return sum + (item ? parseInt(item.noresturant, 10) : 0);
    }, 0);

    return data1Total + data2Total;
  };

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background 
      }
    ]}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose categories</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => [setSelectedIds([]), setSelectedIds1([])]}> 
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}>
        {/* Popular Categories Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Popular categories
        </Text>
        <FlatList
          numColumns={4}
          data={data2}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.popularList}
        />

        {/* All Categories Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          All other categories
        </Text>
        <FlatList
          data={data1}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem1}
          scrollEnabled={false}
          contentContainerStyle={styles.allCategoriesList}
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>
          View {calculateTotal()} places
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#FF5252',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 2
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  resetButton: {
    padding: 5,
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(15),
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  itemContent: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  image: {
    height: 65,
    width: 68,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  dishtext: {
    fontSize: moderateScale(13),
    marginTop: 8,
    textAlign: 'center',
  },
  popularList: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  allcategoriesview: {
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: moderateScale(14),
    flexShrink: 1,
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  allCategoriesList: {},
  footer: {
    backgroundColor: colors.background,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  viewButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 30,
  },
  viewButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selecteddishtext: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  checkIconContainer: {
    position: 'absolute',
    top: "55%",
    right: -2,
    backgroundColor: 'red',
    borderRadius: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Seeall;