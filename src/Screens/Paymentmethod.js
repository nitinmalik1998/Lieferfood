import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../State/ThemeContext'; // Adjust import path as needed
import { useNavigation } from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const Paymentmethod = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const { getColors } = useTheme();
  const colors = getColors();

  const data = [
    {
      id: 1,
      image: 'https://iconape.com/wp-content/png_logo_vector/apple-pay-payment-mark.png',
      Paymentmethodname: 'Apple Pay',
    },
    {
      id: 2,
      image: 'https://static.vecteezy.com/system/resources/previews/019/006/277/original/money-cash-icon-png.png',
      Paymentmethodname: 'Cash',
    },
    {
      id: 3,
      image: 'https://cdn0.iconfinder.com/data/icons/flat-strokes-money/512/Credit_Cards-1024.png',
      Paymentmethodname: 'Credit or Debit card',
    },
    {
      id: 4,
      image: 'https://icon-library.com/images/paypal-icon-png/paypal-icon-png-0.jpg',
      Paymentmethodname: 'PayPal',
    },
    {
      id: 5,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Klarna_Payment_Badge.svg/1600px-Klarna_Payment_Badge.svg.png?20200611133815',
      Paymentmethodname: 'Klarna',
    },
    {
      id: 6,
      image: 'https://cdn-icons-png.flaticon.com/512/4660/4660062.png',
      Paymentmethodname: 'Card Machine',
    },
  ];

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const borderColor = isSelected ? colors.headerBg : colors.border;
    const backgroundColor = isSelected ? colors.headerBg : colors.card;
    const color = isSelected ? colors.white : colors.text;

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={[
          styles.item,
          {
            borderRadius: 15,
            borderColor,
            backgroundColor,
          },
        ]}>
        <View style={styles.itemContent}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={[styles.title, { color, fontWeight: 'bold' }]}>
            {item.Paymentmethodname}
          </Text>
          {isSelected && (
            <View style={styles.checkIconContainer}>
              <Icon name="check" size={25} color={colors.white} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ 
      flex:1,
      paddingTop: insets.top,
      backgroundColor: colors.background ,
        paddingBottom: insets.bottom,
    }}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrowleft" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={[styles.Paymenttext, { color: colors.white }]}>
          Select payment method
        </Text>
      </View>

      <View style={styles.view}>
        <Text style={[styles.paymentmethodtext, { color: colors.text }]}>
          Payment methods
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={selectedId}
          style={styles.list}
        />
        <TouchableOpacity>
          <Text style={[
            styles.confirm, 
            { 
              backgroundColor: colors.headerBg,
              color: colors.white 
            }
          ]}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  Paymenttext: {
    textAlign: 'center',
    fontSize: moderateScale(17),
    flex: 1,
    fontWeight: 'bold',
    marginRight: '10%',
  },
  paymentmethodtext: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  view: {
    marginHorizontal: 15,
    flex: 1,
  },
  item: {
    padding: 2,
    paddingHorizontal: 15,
    marginVertical: 9,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 15,
  },
  title: {
    fontSize: moderateScale(16),
    flex: 1,
  },
  list: {
    flex: 1,
  },
  confirm: {
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: "8%",
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Paymentmethod;