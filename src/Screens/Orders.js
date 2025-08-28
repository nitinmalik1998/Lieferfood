import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../State/ThemeContext'; // Import the theme context

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

const Orders = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigation = useNavigation();
  const { theme, getColors } = useTheme(); // Get theme and colors
  const colors = getColors(); // Extract colors based on theme

   const data = [
    {
      id: 1,
      image:
        'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      dishname: 'Pizza Love',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '2 × Achari Taste Pizza',
      dish2: '1 × Coke [600 ml]',
      key:'Delivery',
      delivery: 'Rejected',

      datetime: '13 Mar 2025 at 11:30 AM',
      price: '120 €',
    },
    {
      id: 2,
      image:
        'https://th.bing.com/th/id/R.47e00e05f8d6528583202cd96e18992a?rik=h%2fdgUexj7W7KZg&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f20400000%2fPIZZA-pizza-20461160-1600-1200.jpg&ehk=Qw%2bjfQA1O8UbLkJhLixjt0h93BHTRzHfXScMqKg1h70%3d&risl=&pid=ImgRaw&r=0',
      dishname: 'Pizza Sweet',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '1 × Cheese Corn Pizza',
      dish2: '1 × Coke [600 ml]',
        key:'Delivery',
      delivery: 'Completed',

      datetime: '10 Mar 2025 at 9:30 AM',
      price: '80 €',
    },
    {
      id: 3,
      image:
        'https://th.bing.com/th/id/R.47e00e05f8d6528583202cd96e18992a?rik=h%2fdgUexj7W7KZg&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f20400000%2fPIZZA-pizza-20461160-1600-1200.jpg&ehk=Qw%2bjfQA1O8UbLkJhLixjt0h93BHTRzHfXScMqKg1h70%3d&risl=&pid=ImgRaw&r=0',
      dishname: 'Pizza Daddy',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '3 × Cheese Pizza',
      dish2: '2 × Fanta [600 ml]',
        key:'Collection',
      delivery: 'Completed',

      datetime: '05 Mar 2025 at 2:40 PM',
      price: '90 €',
    },
    {
      id: 4,
      image:
        'https://static.vecteezy.com/system/resources/previews/016/117/081/non_2x/pepperoni-pizza-with-a-slice-taken-out-with-cheese-pull-photo.jpg',
      dishname: 'Pizza Mummy',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '4 × Cheese Corn Pizza',
      dish2: '5 × Coke [600 ml]',
         key:'Collection',
      delivery: 'Rejected',

      datetime: '03 Mar 2025 at 8:30 AM',
      price: '70 €',
    },
    {
      id: 5,
      image:
        'https://cdn.britannica.com/08/177308-050-94D9D6BE/Food-Pizza-Basil-Tomato.jpg',
      dishname: 'Pizza Love',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '3 × Achari Taste Pizza',
      dish2: '2 × Coke [600 ml]',
         key:'Collection',
      delivery: 'Completed',

      datetime: '01 Mar 2025 at 12:30 PM',
      price: '120 €',
    },
    {
      id: 6,
      image:
        'https://th.bing.com/th/id/R.47e00e05f8d6528583202cd96e18992a?rik=h%2fdgUexj7W7KZg&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f20400000%2fPIZZA-pizza-20461160-1600-1200.jpg&ehk=Qw%2bjfQA1O8UbLkJhLixjt0h93BHTRzHfXScMqKg1h70%3d&risl=&pid=ImgRaw&r=0',
      dishname: 'Curry wurst',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '3 × Cheese Pizza',
      dish2: '2 × Fanta [600 ml]',
         key:'Delivery',
      delivery: 'Rejected',

      datetime: '05 Mar 2025 at 2:40 PM',
      price: '60 €',
    },
    {
      id: 7,
      image:
        'https://th.bing.com/th/id/R.47e00e05f8d6528583202cd96e18992a?rik=h%2fdgUexj7W7KZg&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f20400000%2fPIZZA-pizza-20461160-1600-1200.jpg&ehk=Qw%2bjfQA1O8UbLkJhLixjt0h93BHTRzHfXScMqKg1h70%3d&risl=&pid=ImgRaw&r=0',
      dishname: 'Sauerbraten',
      address: '52/4 C-Block Sector 63,Noida',
      dish1: '3 × Cheese Pizza',
      dish2: '2 × Fanta [600 ml]',
         key:'Colllection',
      delivery: 'Delivered',

      datetime: '05 Mar 2025 at 2:40 PM',
      price: '50 €',
    },
  ];

  const filteredData = data.filter(
    item =>
      item.dishname.toLowerCase().includes(search.toLowerCase()) ||
      item.price.toLowerCase().includes(search.toLowerCase()) ||
      item.datetime.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={{paddingVertical: 10}}>
        <View style={{elevation: theme === 'DARK' ? 0 : 10}}>
          <View style={[
            styles.upperview, 
            { backgroundColor: theme === 'DARK' ? colors.card : '#E3E4E0' }
          ]}>
            <Image source={{uri: item.image}} style={styles.image} />
            <View style={styles.middleView}>
              <Text 
                style={[styles.dishname, {color: colors.text}]} 
                numberOfLines={1}
              >
                {item.dishname}
              </Text>
              <Text 
                style={[styles.address, {color: colors.placeholder}]} 
                numberOfLines={2}
              >
                {item.address}
              </Text>
            </View>
            <TouchableOpacity>
              <View style={styles.deliveryContainer}>
                <Text
                  style={[
                    styles.deliveryType,
                    { 
                      color: item.delivery === 'Completed' ? 'green' : 'red',
                      backgroundColor: theme === 'DARK' ? colors.background : '#f5f5f5'
                    }
                  ]}>
                  {item.key}
                </Text>
                <Text
                  style={[
                    styles.deliveryStatus,
                    { 
                      color: item.delivery === 'Completed' ? 'green' : 'red',
                      backgroundColor: theme === 'DARK' ? colors.background : '#f5f5f5'
                    }
                  ]}>
                  {item.delivery}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[
            styles.bottomview,
            { 
              backgroundColor: theme === 'DARK' ? colors.card : 'white',
              borderColor: colors.border
            }
          ]}>
            <Text style={[styles.dishtext, {color: colors.text}]}>{item.dish1}</Text>
            <Text style={[styles.dishtext, {color: colors.text}]}>{item.dish2}</Text>
            <View style={[styles.line, {backgroundColor: colors.border}]} />
            <View style={styles.datepriceview}>
              <Text style={[styles.datetimetext, {color: colors.placeholder}]}>{item.datetime}</Text>
              <Text style={[styles.pricetext, {color: colors.text}]}>{item.price}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background,
      }}>
      {/* Search Header (Conditional) */}
      {showSearch ? (
        <View style={[styles.header, {justifyContent: 'space-between', backgroundColor: '#FF0000'}]}>
          <TouchableOpacity
            onPress={() => setShowSearch(false)}
            style={styles.backButton}>
            <Icon name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
          <View style={[
            styles.searchContainer,
            { 
              backgroundColor: theme === 'DARK' 
                ? 'rgba(0, 0, 0, 0.5)' 
                : 'rgba(255, 255, 255, 0.5)'
            }
          ]}>
            <TextInput
              style={[styles.input, {color: 'white'}]}
              placeholder="Search by dish, date..."
              placeholderTextColor="rgba(255,255,255,0.8)"
              value={search}
              onChangeText={setSearch}
              autoFocus={true}
              selectionColor="white"
            />
          </View>
          <TouchableOpacity style={styles.searchIconHeader}>
            <Icon name="search1" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.header, {backgroundColor: '#FF0000'}]}>
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={styles.backButton}>
            <Icon name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Orders</Text>
          <TouchableOpacity
            onPress={() => setShowSearch(true)}
            style={styles.searchIconHeader}>
            <Icon name="search1" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 15}} 
          style={[styles.flatlist, {marginBottom: insets.bottom + 25}]}
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  backButton: {
    paddingLeft: moderateScale(15),
  },
  title: {
    color: 'white',
    fontFamily: 'poppin-Medium',
    fontWeight: 'bold',
    fontSize: moderateScale(20),
    textAlign: 'center',
    flex: 1,
  },
  searchIconHeader: {
    paddingRight: moderateScale(15),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    height: verticalScale(40),
    borderRadius:15,
  },
  searchIcon: {
    marginRight: moderateScale(10),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    paddingVertical: 0,
  },
  image: { 
    height: verticalScale(85),
    width: moderateScale(60),
    marginLeft: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  dishname: { 
    fontFamily: 'poppins-Medium', 
    fontWeight: 'bold', 
    fontSize: moderateScale(16),
    marginBottom: verticalScale(4),
  },
  address: { 
    fontFamily: 'poppins-Regular', 
    fontSize: moderateScale(12),
    lineHeight: moderateScale(14),
    width: "80%",
  },
  upperview: {
    flexDirection: 'row',
    marginHorizontal: moderateScale(15),
    paddingVertical: verticalScale(10),
    borderTopRightRadius: moderateScale(15),
    borderTopLeftRadius: moderateScale(15),
    alignItems: 'center',
  },
  bottomview: {
    marginHorizontal: moderateScale(15),
    borderBottomLeftRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    borderWidth:1.5,
  },
  dishtext: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginLeft: moderateScale(15),
    paddingVertical: verticalScale(5),
    fontFamily: 'poppins-Medium',
  },
  line: {
    height: 1,
    marginTop: verticalScale(10),
    marginHorizontal: moderateScale(10),
  },
  datepriceview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(15),
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  datetimetext: {
    fontSize: moderateScale(12),
  },
  pricetext: {
    fontFamily: 'poppins-Regular', 
    fontSize: moderateScale(15), 
    fontWeight: 'bold'
  },
  flatlist: {
    marginTop: verticalScale(10), 
  },
  middleView: {
    flex: 1,
    marginHorizontal: moderateScale(10),
    justifyContent: 'center',
  },
  deliveryContainer: {
    marginRight: moderateScale(10),
    minWidth: moderateScale(80),
    alignItems:"flex-end",
  },
  deliveryType: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(4),
    fontSize: moderateScale(12),
    marginBottom: verticalScale(4),
    textAlign: 'center',
    fontWeight:"500",
  },
  deliveryStatus: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(4),
    fontSize: moderateScale(12),
    textAlign: 'center',
    fontWeight:"500"
  },
});

export default Orders;