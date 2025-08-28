import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

const Favourites = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme, getColors } = useTheme();
  const colors = getColors();

  // Fixed styles definition - removed colors.placeholder dependency
  const styles = useMemo(() => StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    personalview: {
      flexDirection: 'row',
      backgroundColor: theme === 'DARK' ? "red" : 'red',
      paddingVertical: 5,
    },
    arrowtouchable: { left: 10 },
    personaltext: {
      marginLeft: "32%",
      color: theme === 'DARK' ? colors.text : 'white',
      fontFamily: 'poppin-Medium',
      fontWeight: 'bold',
      fontSize: moderateScale(20),
    },
    flatlist: {
      backgroundColor: colors.background,
    },
    container: { 
      marginHorizontal: 20, 
      marginTop: 25,
      backgroundColor: colors.background,
    },
    heart: {
      zIndex: 1,
      top: 10,
      alignItems: 'flex-end',
      right: 10,
      position: 'absolute',
    },
    image: {
      height: 180,
      width: '100%',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    detailview: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderColor: colors.border,
      borderWidth: theme === 'DARK' ? 1 : 0,
      borderTopWidth: 0,
    },
    whiteBackground: {
      backgroundColor: colors.card1,borderBottomLeftRadius:10,borderBottomRightRadius:10,
    },
    spacedishview: { marginHorizontal: 10, marginVertical: 10 ,},
    dishview: { flexDirection: 'row', justifyContent: 'space-between' },
    dishnametext: {
      fontFamily: 'poppins-Medium',
      fontWeight: 'bold',
      fontSize: moderateScale(17),
      color: colors.text,
    },
    flexDirection: { flexDirection: 'row' },
    ratetext: { color: 'red', marginLeft: 2 },
    viewcounttext: { color: colors.placeholder, marginLeft: 3 },
    secondlineview: {
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    timetext: {
      color: colors.placeholder,
      fontSize: moderateScale(12),
      marginLeft: 5,
      marginTop: -1.8
    },
    bikeicon: { marginLeft: 5, marginTop: -2 },
    priceview: { flexDirection: 'row', marginLeft: 4, marginTop: -2 },
    pricetext: {
      color: colors.placeholder,
      fontSize: moderateScale(12),
      marginLeft: 5
    },
    euroicon: { marginLeft: 2, marginTop: 2 },
    lockview: { flexDirection: 'row', marginLeft: 10, marginTop: -2 },
    minimumpricetext: {
      color: colors.placeholder,
      fontSize: moderateScale(12),
      marginLeft: 5
    },
    euroicon2: { marginLeft: 2, marginTop: 2 },
    sponsoredview: { flexDirection: 'row', marginLeft: 5, marginTop: -1 },
    rightarrowicon: {
      color: colors.placeholder,
      fontSize: moderateScale(12),
      marginLeft: 5
    },
    sponsoredtext: {
      marginLeft: 3,
      color: colors.placeholder,
      fontSize: moderateScale(12),
      marginTop: -1.5
    },
    offerview: { flexDirection: 'row', marginTop: 10, marginLeft: 5 },
    offericon: { backgroundColor: 'yellow', padding: 4, borderRadius: 20 },
    offertext: {
      marginLeft: 8,
      color: colors.placeholder,
      fontSize: moderateScale(13),
      marginTop: 2,
      fontWeight: 'bold',
    },
  }), [theme, colors]); // Fixed dependency array

  // Fixed Data definition - use theme directly
  const Data = useMemo(() => [
    {
      id: 1,
      foodpic: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg?w=2000',
      hearticon: <Icon name="heart" size={22} color="red" />,
      dishname: 'Pizzeria Dhillon',
      staricon: <Icon1 name="star" size={18} color="red" />,
      rate: '4.2',
      viewcount: '(4.2k)',
      clockicon: <Icon2 name="clock" size={13} color={colors.placeholder} />,
      time: '20-45 min',
      bikeicon: <Icon3 name="motorbike" size={17} color={colors.placeholder} />,
      price: '2.00',
      euroicon: <Icon1 name="euro" size={13} color={colors.placeholder} />,
      lockicon: <Icon4 name="bag" size={13} color={colors.placeholder} />,
      minimumprice: 'Min 10.00',
      rightarrowicon: <Icon2 name="square-arrow-up-right" size={13} color={colors.placeholder} />,
      sponsored: 'Sponsored',
      offericon: <Icon5 name="local-offer" size={16} color="red" />,
      offer: 'Offer',
    },
    {
      id: 2,
      foodpic: 'https://wallup.net/wp-content/uploads/2017/11/17/371885-food-pizza.jpg',
      hearticon: <Icon name="heart" size={22} color="red" />,
      dishname: 'Pizzeria Ragazzi',
      staricon: <Icon1 name="star" size={18} color="red" />,
      rate: '4.4',
      viewcount: '(2.1k)',
      clockicon: <Icon2 name="clock" size={13} color={colors.placeholder} />,
      time: '20-35 min',
      bikeicon: <Icon3 name="motorbike" size={17} color={colors.placeholder} />,
      price: '3.00',
      euroicon: <Icon1 name="euro" size={13} color={colors.placeholder} />,
      lockicon: <Icon4 name="bag" size={13} color={colors.placeholder} />,
      minimumprice: 'Min 10.00',
      rightarrowicon: <Icon2 name="square-arrow-up-right" size={13} color={colors.placeholder} />,
      sponsored: 'Sponsored',
      offericon: <Icon5 name="local-offer" size={16} color="red" />,
      offer: 'Offer',
    },
    {
      id: 3,
      foodpic: 'https://cdn.britannica.com/08/177308-050-94D9D6BE/Food-Pizza-Basil-Tomato.jpg',
      hearticon: <Icon name="heart" size={22} color="red" />,
      dishname: 'Pizzeria Moza',
      staricon: <Icon1 name="star" size={18} color="red" />,
      rate: '4.1',
      viewcount: '(1.1k)',
      clockicon: <Icon2 name="clock" size={13} color={colors.placeholder} />,
      time: '20-45 min',
      bikeicon: <Icon3 name="motorbike" size={17} color={colors.placeholder} />,
      price: '2.00',
      euroicon: <Icon1 name="euro" size={13} color={colors.placeholder} />,
      lockicon: <Icon4 name="bag" size={13} color={colors.placeholder} />,
      minimumprice: 'Min 10.00',
      rightarrowicon: <Icon2 name="square-arrow-up-right" size={13} color={colors.placeholder} />,
      sponsored: 'Sponsored',
      offericon: <Icon5 name="local-offer" size={16} color="red" />,
      offer: 'Offer',
    },
    {
      id: 4,
      foodpic: 'https://static.vecteezy.com/system/resources/previews/016/117/081/non_2x/pepperoni-pizza-with-a-slice-taken-out-with-cheese-pull-photo.jpg',
      hearticon: <Icon name="heart" size={22} color="red" />,
      dishname: 'Pizzeria Daddy',
      staricon: <Icon1 name="star" size={18} color="red" />,
      rate: '3.9',
      viewcount: '(1.7k)',
      clockicon: <Icon2 name="clock" size={13} color={colors.placeholder} />,
      time: '20-30 min',
      bikeicon: <Icon3 name="motorbike" size={17} color={colors.placeholder} />,
      price: '5.00',
      euroicon: <Icon1 name="euro" size={13} color={colors.placeholder} />,
      lockicon: <Icon4 name="bag" size={13} color={colors.placeholder} />,
      minimumprice: 'Min 10.00',
      rightarrowicon: <Icon2 name="square-arrow-up-right" size={13} color={colors.placeholder} />,
      sponsored: 'Sponsored',
      offericon: <Icon5 name="local-offer" size={16} color="red" />,
      offer: 'Offer',
    },
    {
      id: 5,
      foodpic: 'https://images7.alphacoders.com/434/434468.jpg',
      hearticon: <Icon name="heart" size={22} color="red" />,
      dishname: 'Pizzeria Delcious',
      staricon: <Icon1 name="star" size={18} color="red" />,
      rate: '3.9',
      viewcount: '(1.7k)',
      clockicon: <Icon2 name="clock" size={13} color={colors.placeholder} />,
      time: '20-30 min',
      bikeicon: <Icon3 name="motorbike" size={17} color={colors.placeholder} />,
      price: '5.00',
      euroicon: <Icon1 name="euro" size={13} color={colors.placeholder} />,
      lockicon: <Icon4 name="bag" size={13} color={colors.placeholder} />,
      minimumprice: 'Min 10.00',
      rightarrowicon: <Icon2 name="square-arrow-up-right" size={13} color={colors.placeholder} />,
      sponsored: 'Sponsored',
      offericon: <Icon5 name="local-offer" size={16} color="red" />,
      offer: 'Offer',
    },
    {
      id: 6,
      foodpic: 'https://s1.1zoom.me/b6152/819/Pizza_Tomatoes_547600_1920x1080.jpg',
      hearticon: <Icon name="heart" size={22} color="red" />,
      dishname: 'Pizzeria Mummy',
      staricon: <Icon1 name="star" size={18} color="red" />,
      rate: '3.9',
      viewcount: '(1.7k)',
      clockicon: <Icon2 name="clock" size={13} color={colors.placeholder} />,
      time: '20-30 min',
      bikeicon: <Icon3 name="motorbike" size={17} color={colors.placeholder} />,
      price: '5.00',
      euroicon: <Icon1 name="euro" size={13} color={colors.placeholder} />,
      lockicon: <Icon4 name="bag" size={13} color={colors.placeholder} />,
      minimumprice: 'Min 10.00',
      rightarrowicon: <Icon2 name="square-arrow-up-right" size={13} color={colors.placeholder} />,
      sponsored: 'Sponsored',
      offericon: <Icon5 name="local-offer" size={16} color="red" />,
      offer: 'Offer',
    },
  ], [theme]); // Fixed dependency array to use theme only

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity>
          <View style={styles.container}>
            <View>
              <TouchableOpacity style={styles.heart}>
                <Text>{item.hearticon}</Text>
              </TouchableOpacity>
              <Image source={{ uri: item.foodpic }} style={styles.image} />
            </View>
            <View style={styles.detailview}>
              <View style={styles.whiteBackground}>
                <View style={styles.spacedishview}>
                  <View style={styles.dishview}>
                    <Text style={styles.dishnametext}>{item.dishname}</Text>
                    <View style={styles.flexDirection}>
                      <View style={styles.flexDirection}>
                        <Text>{item.staricon}</Text>
                        <Text style={styles.ratetext}>{item.rate}</Text>
                      </View>
                      <Text style={styles.viewcounttext}>{item.viewcount}</Text>
                    </View>
                  </View>
                  <View style={styles.secondlineview}>
                    <View style={styles.flexDirection}>
                      <Text>{item.clockicon}</Text>
                      <Text style={styles.timetext}>{item.time}</Text>
                      <Text style={styles.bikeicon}>{item.bikeicon}</Text>
                    </View>
                    <View style={styles.priceview}>
                      <Text style={styles.pricetext}>{item.price}</Text>
                      <Text style={styles.euroicon}>{item.euroicon}</Text>
                    </View>
                    <View style={styles.lockview}>
                      <Text>{item.lockicon}</Text>
                      <Text style={styles.minimumpricetext}>
                        {item.minimumprice}
                      </Text>
                      <Text style={styles.euroicon2}>{item.euroicon}</Text>
                    </View>
                    <View style={styles.sponsoredview}>
                      <Text style={styles.rightarrowicon}>
                        {item.rightarrowicon}
                      </Text>
                      <Text style={styles.sponsoredtext}>{item.sponsored}</Text>
                    </View>
                  </View>
                  <View style={styles.offerview}>
                    <Text style={styles.offericon}>{item.offericon}</Text>
                    <Text style={styles.offertext}>{item.offer}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top, marginBottom: insets.bottom + 0 }]}>
      <View style={styles.personalview}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={styles.arrowtouchable}>
          <Icon 
            name="arrowleft" 
            size={28} 
            color={theme === 'DARK' ? colors.text : 'white'} 
          />
        </TouchableOpacity>
        <Text style={styles.personaltext}>Favourites</Text>
      </View>

      <FlatList
        data={Data}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={renderItem}
        style={styles.flatlist}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Favourites;