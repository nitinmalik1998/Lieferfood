// Pricereceipt.js
import React, { useMemo } from "react";
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Image, 
  Dimensions,
  ScrollView
} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../State/CartContext';
import { useTheme } from '../State/ThemeContext'; // Import ThemeContext

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => 
  Math.round(size + (scale(size) - size) * factor);

const Pricereceipt = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme, getColors } = useTheme(); // Get theme and colors
  const colors = getColors();
  
  // Get cart data
  const { 
    cartItems, 
    calculateCartTotal,
    calculateDeliveryFee,
    totalItemsCount
  } = useCart();
  
  // Calculate prices
  const subtotal = calculateCartTotal();
  const isSpecialOfferEligible = subtotal >= 10;
  const discountAmount = isSpecialOfferEligible ? subtotal * 0.12 : 0;
  const serviceFee = Math.min(0.99, (subtotal - discountAmount) * 0.025);
  const deposit = cartItems.length * 0.15;
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal - discountAmount + serviceFee + deposit + deliveryFee;
  
  // Current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Create dynamic styles based on theme
  const styles = useMemo(() => {
    return StyleSheet.create({
      receipttext: {
        alignSelf: 'center',
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.text,
      },
      arrowtouchable: {
        padding: 5,
      },
      separator: {
        borderBottomWidth: 1,
        borderColor: colors.border,
        marginVertical: 12,
        marginHorizontal: 15,
      },
      restaurantname: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 5,
      },
      orderdetailtext: {
        fontSize: moderateScale(14),
        color: colors.placeholder,
      },
      smallLogo: {
        height: 50,
        width: 50,
        borderRadius: 8,
      },
      itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginHorizontal: 15,
        marginBottom: 5,
      },
      itemName: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: colors.text,
        marginBottom: 3,
      },
      itemSize: {
        fontSize: moderateScale(15),
        color: colors.text,
        marginBottom: 3,
      },
      itemOption: {
        fontSize: moderateScale(14),
        color: colors.placeholder,
        marginBottom: 2,
      },
      itemNote: {
        fontSize: moderateScale(14),
        color: colors.placeholder,
        fontStyle: 'italic',
        marginTop: 5,
      },
      itemPrice: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.text,
      },
      itemQuantity: {
        fontSize: moderateScale(14),
        color: colors.placeholder,
        marginVertical: 5,
      },
      priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginVertical: 5,
      },
      priceLabel: {
        fontSize: moderateScale(16),
        color: colors.text,
      },
      priceValue: {
        fontSize: moderateScale(16),
        color: colors.text,
        fontWeight: '500',
      },
      discountText: {
        fontSize: moderateScale(16),
        color: 'red',
        fontWeight: '500',
      },
      totalSeparator: {
        borderBottomWidth: 1,
        borderColor: colors.border,
        marginVertical: 10,
        marginHorizontal: 15,
      },
      totalLabel: {
        fontSize: moderateScale(17),
        fontWeight: 'bold',
        color: colors.text,
      },
      totalPrice: {
        fontSize: moderateScale(17),
        fontWeight: 'bold',
        color: colors.text,
      },
      dateText: {
        fontSize: moderateScale(16),
        color: colors.text,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 10,
      },
    });
  }, [theme, colors]); // Recreate styles when theme changes

  // Render cart items
  const renderCartItem = (item, index) => (
    <View key={item.id} style={{ marginBottom: 15 }}>
      <View style={styles.itemRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>(Quantity: {item.quantity})</Text>
          {item.size && <Text style={styles.itemSize}>{item.size}</Text>}
          
          {item.options && item.options.length > 0 && (
            <View>
              {item.options.map((option, idx) => (
                <Text key={idx} style={styles.itemOption}>
                  + {option.name}
                </Text>
              ))}
            </View>
          )}
          
          {item.note && (
            <Text style={styles.itemNote}>Note: {item.note}</Text>
          )}
        </View>
        <Text style={styles.itemPrice}>
          {((item.basePrice + item.optionsTotal) * item.quantity).toFixed(2)} €
        </Text>
      </View>
      <View style={styles.separator}></View>
    </View>
  );

  return (
    <ScrollView 
      style={{ 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom,
        backgroundColor: colors.background
      }}
    >
      <View style={{ paddingHorizontal: 8, flexDirection: 'row', gap: 15, marginTop: 1 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.arrowtouchable}
        >
          <Icon name="arrowleft" size={30} color="red" />
        </TouchableOpacity>
        <Text style={styles.receipttext}>Your receipt</Text>
      </View>
      
      <View style={styles.separator}></View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15 }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={styles.restaurantname}>
            Restaurant Pizzeria Dhillon
          </Text>
          <Text style={styles.orderdetailtext}>Order no. XGBTDQ</Text>
        </View>
        <Image
          source={{
            uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo_67365fe19d901.jpeg',
          }}
          style={styles.smallLogo}
        />
      </View>
      
      <View style={styles.separator}></View>
      
      {/* Cart Items */}
      {cartItems.map((item, index) => renderCartItem(item, index))}
      
      {/* Price Breakdown */}
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Subtotal</Text>
        <Text style={styles.priceValue}>{subtotal.toFixed(2)} €</Text>
      </View>
      
      {isSpecialOfferEligible && (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Multibuy Discount (12%)</Text>
          <Text style={styles.discountText}>
            -{discountAmount.toFixed(2)} €
          </Text>
        </View>
      )}
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Service Fee</Text>
        <Text style={styles.priceValue}>{serviceFee.toFixed(2)} €</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Deposit</Text>
        <Text style={styles.priceValue}>{deposit.toFixed(2)} €</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Delivery Fee</Text>
        <Text style={styles.priceValue}>{deliveryFee.toFixed(2)} €</Text>
      </View>
      
      <View style={styles.totalSeparator} />
      
      <View style={styles.priceRow}>
        <Text style={styles.totalLabel}>Total Paid</Text>
        <Text style={styles.totalPrice}>{total.toFixed(2)} €</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Payment Method</Text>
        <Text style={styles.priceValue}>Cash</Text>
      </View>
      
      <View style={styles.separator}></View>
      
      <View style={{ marginHorizontal: 15, marginBottom: 80 }}>
        <Text style={styles.dateText}>Ordered on {formattedDate}</Text>
      </View>
    </ScrollView>
  );
};

export default Pricereceipt;