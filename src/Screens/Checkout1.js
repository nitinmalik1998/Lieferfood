import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../State/CartContext';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const Checkout = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { 
    cartItems, 
    calculateCartTotal,
    totalItemsCount,
    calculateDeliveryFee
  } = useCart();
  
  const { getColors } = useTheme();
  const colors = getColors();
  
  // Calculate prices
  const subtotal = calculateCartTotal();
  const isSpecialOfferEligible = subtotal >= 10;
  const discountAmount = isSpecialOfferEligible ? subtotal * 0.12 : 0;
  const serviceFee = Math.min(0.99, (subtotal - discountAmount) * 0.025);
  const deposit = cartItems.length * 0.15;
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal - discountAmount + serviceFee + deposit + deliveryFee;

  // Helper functions to get the time boundaries
  const getTodayAt10AM = () => {
    const date = new Date();
    return date;
  };

  // User data state
  const [userData, setUserData] = useState({
    firstName: 'Sulakhan',
    lastName: 'Dhillon',
    phone: '9786534521',
    collectionTime: getTodayAt10AM(),
  });

  // States for edit forms
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  // States for time selection
  const [activeTab, setActiveTab] = useState('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  // Refs for bottom sheets
  const detailsSheetRef = useRef(null);
  const timeSheetRef = useRef(null);
  const orderSummarySheetRef = useRef(null);

  const openDetailsSheet = () => {
    setEditedData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });
    detailsSheetRef.current.open();
  };

  const openTimeSheet = () => {
    timeSheetRef.current.open();
  };

  // Close all bottom sheets
  const closeBottomSheet = () => {
    detailsSheetRef.current.close();
    timeSheetRef.current.close();
    orderSummarySheetRef.current.close();
  };

  // Save user details
  const handleSave = () => {
    setUserData({
      ...userData,
      firstName: editedData.firstName,
      lastName: editedData.lastName,
      phone: editedData.phone,
    });
    closeBottomSheet();
  };

  const formatDisplayTime = date => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return `${format(date, 'MMMM d')} at ${format(date, 'h:mm a')}`;
    }
  };

  const handleTimeSelect = () => {
    if (selectedTimeSlot) {
      setUserData({
        ...userData,
        collectionTime: selectedTimeSlot,
      });
    }
    closeBottomSheet();
  };

  // Generate time slots from 11:00 AM to 12:00 AM in 5-minute intervals
  const generateTimeSlots = (day) => {
    const slots = [];
    const baseDate = day === 'today' ? new Date() : addDays(new Date(), 1);
    
    // Set start time to 11:00 AM
    baseDate.setHours(0, 0, 0, 0);
    
    // Set end time to 11:55 PM (just before midnight)
    const endDate = new Date(baseDate);
    endDate.setHours(23, 55, 0, 0);
    
    let current = new Date(baseDate);
    
    while (current <= endDate) {
      // For today, skip past times
      if (day !== 'today' || current > new Date()) {
        slots.push(new Date(current));
      }
      current = new Date(current.getTime() + 5 * 60000); // Add 5 minutes
    }
    
    return slots;
  };

  // Initialize time slots when component mounts
  useEffect(() => {
    setTimeSlots(generateTimeSlots(activeTab));
    
    // Set initial selected time slot to the first available slot
    if (activeTab === 'today') {
      const todaySlots = generateTimeSlots('today');
      setSelectedTimeSlot(todaySlots.length > 0 ? todaySlots[0] : null);
    } else {
      const tomorrowSlots = generateTimeSlots('tomorrow');
      setSelectedTimeSlot(tomorrowSlots.length > 0 ? tomorrowSlots[0] : null);
    }
  }, []);

  // Update time slots when tab changes
  useEffect(() => {
    const slots = generateTimeSlots(activeTab);
    setTimeSlots(slots);
    
    // Auto-select the first slot when switching tabs
    if (slots.length > 0) {
      setSelectedTimeSlot(slots[0]);
    }
  }, [activeTab]);

  const [isChecked, setIsChecked] = useState(false);

  // Render cart items in order summary
  const renderCartItem = ({ item, index }) => (
    <View style={[styles.itemRow, { borderBottomColor: colors.divider }]}>
      <Text style={[styles.itemQuantity, { color: colors.text }]}>{index + 1}.</Text>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemQuantity1, { color: colors.placeholder }]}>(Quantity: {item.quantity})</Text>
        {item.size && <Text style={[styles.itemSize, { color: colors.text }]}>{item.size}</Text>}
        
        {item.options && item.options.length > 0 && (
          <View>
            {item.options.map((option, idx) => (
              <Text key={idx} style={[styles.itemOption, { color: colors.placeholder }]}>
                + {option.name}
              </Text>
            ))}
          </View>
        )}
        
        {item.note && (
          <Text style={[styles.itemNote, { color: colors.placeholder }]}>Note: {item.note}</Text>
        )}
      </View>
      <Text style={[styles.itemPrice, { color: colors.text }]}>
        {((item.basePrice + item.optionsTotal) * item.quantity).toFixed(2)} €
      </Text>
    </View>
  );

  // Create styles with theme colors
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.container,
        { 
          paddingTop: insets.top, 
          paddingBottom: insets.bottom,
          backgroundColor: colors.background
        },
      ]}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.arrowtouchable}>
          <Icon name="arrowleft" size={30} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.Paymenttext}>Checkout</Text>
      </View>

      <ScrollView style={styles.scrollview}>
        <Text style={[styles.titletext, { color: colors.text }]}>Order details</Text>

        {/* User Details Section */}
        <TouchableOpacity onPress={openDetailsSheet}>
          <View style={styles.detailsContainer}>
            <Text style={styles.icon}>
              <Icon name="user" size={28} color={colors.headerBg} />
            </Text>
            <View style={styles.detailsTextContainer}>
              <Text style={[styles.detailtext, { color: colors.text }]}>
                {userData.firstName} {userData.lastName}
              </Text>
              <Text style={[styles.detailtext, { color: colors.text }]}>{userData.phone}</Text>
            </View>
            <Text style={styles.icon}>
              <Icon name="right" size={25} color={colors.icon} />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.lineview, { borderColor: colors.divider }]}></View>
        
        {/* Collection Time Section */}
        <TouchableOpacity onPress={openTimeSheet}>
          <View style={styles.detailsContainer}>
            <Text style={styles.icon}>
              <Icon name="clockcircleo" size={28} color={colors.headerBg} />
            </Text>
            <View style={styles.detailsTextContainer}>
              <Text style={[styles.detailtext, { color: colors.text }]}>Collection scheduled</Text>
              <Text style={[styles.detailtext, { color: colors.text }]}>
                {formatDisplayTime(userData.collectionTime)}
              </Text>
            </View>
            <Text style={styles.icon}>
              <Icon name="right" size={25} color={colors.icon} />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.lineview1, { borderColor: colors.divider }]}></View>
        
        <View>
          <Text style={[styles.titletext, { color: colors.text }]}>Vouchers & Discounts </Text>
        </View>

        <TouchableOpacity>
          <View style={styles.detailsContainer}>
            <Text style={styles.icon}>
              <Icon name="wallet" size={28} color={colors.headerBg} />
            </Text>
            <View style={styles.detailsTextContainer}>
              <Text style={[styles.detailtext1, { color: colors.placeholder }]}>
                Vouchers can't be used {'\n'}with your payment method
              </Text>
            </View>
            <Text style={styles.icon}>
              <Icon name="right" size={25} color={colors.icon} />
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.lineview1, { borderColor: colors.divider }]}></View>
        
        <View>
          <Text style={[styles.titletext, { color: colors.text }]}>How would you like to pay? </Text>
        </View>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Paymentmethod');
        }}>
          <View style={styles.detailsContainer}>
            <Text style={styles.icon}>
              <Icon name="wallet" size={28} color={colors.headerBg} />
            </Text>
            <View style={styles.detailsTextContainer}>
              <Text style={[styles.detailtext1, { color: colors.text }]}>
                Cash
              </Text>
            </View>
            <Text style={styles.icon}>
              <Icon name="right" size={25} color={colors.icon} />
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={[styles.lineview1, { borderColor: colors.divider }]}></View>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
          <View style={styles.checkboxContainer}>
            <View
              style={[
                styles.checkbox, 
                isChecked && styles.checkedCheckbox,
                { 
                  backgroundColor: isChecked ? colors.headerBg : colors.background,
                  borderColor: colors.border
                }
              ]}>
              {isChecked && <Icon2 name="check" size={20} color={colors.white} />}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={[styles.recievediscounttext, { color: colors.text }]}>
                Recieve discounts, loyalty{' '}
              </Text>
              <Text style={[styles.recievediscounttext, { color: colors.text }]}>
                offers and other updates{' '}
              </Text>
              <Text style={[styles.recievediscounttext, { color: colors.text }]}>
                email, SMS and push{' '}
              </Text>
              <Text style={[styles.recievediscounttext, { color: colors.text }]}>notification </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={[styles.lineview1, { borderColor: colors.divider }]}></View>
        
        <View>
          <Text style={[styles.titletext, { color: colors.text }]}>Order summary </Text>
          <TouchableOpacity onPress={() => orderSummarySheetRef.current.open()}>
            <View style={styles.restaurantContainer}>
              <Image
                source={{
                  uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo_67365fe19d901.jpeg',
                }}
                style={styles.smallLogo}
              />
              <View style={styles.restaurantDetails}>
                <Text style={[styles.restaurantName, { color: colors.text }]}>Restaurant</Text>
                <Text style={[styles.restaurantName, { color: colors.text }]}>Pizzeria Dhillon</Text>
                <Text style={[styles.itemCount, { color: colors.placeholder }]}>{totalItemsCount} items</Text>
              </View>
              <Icon name="right" size={25} color={colors.icon} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.lineview, { borderColor: colors.divider }]}></View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel1, { color: colors.text }]}>Subtotal</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>{subtotal.toFixed(2)} €</Text>
        </View>

         {isSpecialOfferEligible && (
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>Multibuy Discount (12%)</Text>
            <Text style={[styles.discountText, { color: colors.text }]}>
              -{discountAmount.toFixed(2)} €
            </Text>
          </View>
        )}

        <View style={[styles.totalSeparator, { borderColor: colors.divider }]} />

        <View style={styles.priceRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Service Fee</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>{serviceFee.toFixed(2)} €</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Deposit</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>{deposit.toFixed(2)} €</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Delivery Fee</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>{deliveryFee.toFixed(2)} €</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>{total.toFixed(2)} €</Text>
        </View>
        
        <View>
          <TouchableOpacity onPress={() => { navigation.navigate("Finalpage") }}>
            <Text style={[styles.orderpaytext, { backgroundColor: colors.headerBg }]}>Order and pay</Text>
          </TouchableOpacity> 
          <View style={styles.viewlower}>
            <Text style={[styles.lowertext, { color: colors.text }]}>
              By clicking on "Order and pay" you agree with the{' '}
            </Text>
            <Text style={[styles.lowertext, { color: colors.text }]}>
              contests of your order, the data you filled out, our{' '}
              <Text style={[styles.underlinedText, { color: colors.linkColor }]}>privacy statement</Text> and{' '}
              <Text style={[styles.underlinedText, { color: colors.linkColor }]}>terms of use</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* User Details Bottom Sheet */}
      <RBSheet
        ref={detailsSheetRef}
        height={780}
        closeOnDragDown={true}
        closeOnPressMask={true}
         closeOnPressBack={true} 
        dragFromTopOnly={false}
        draggable={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: colors.border,
            width: 40,
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 15,
            backgroundColor: colors.sheetBackground,
          },
        }}>
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>Your Details</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>First Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={editedData.firstName}
              onChangeText={text =>
                setEditedData({...editedData, firstName: text})
              }
              placeholder="Enter first name"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Last Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={editedData.lastName}
              onChangeText={text =>
                setEditedData({...editedData, lastName: text})
              }
              placeholder="Enter last name"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Phone</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={editedData.phone}
              onChangeText={text => setEditedData({...editedData, phone: text})}
              placeholder="Enter phone number"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.bottomSheetButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.card }]}
              onPress={closeBottomSheet}>
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.headerBg }]}
              onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      {/* Time Selection Bottom Sheet */}
      <RBSheet
        ref={timeSheetRef}
        height={1000}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={false}
            closeOnPressBack={true} 
        draggable={true}
        onOpen={() => {
          if (isToday(userData.collectionTime)) {
            setActiveTab('today');
            setSelectedTimeSlot(userData.collectionTime);
          } else {
            setActiveTab('tomorrow');
            setSelectedTimeSlot(userData.collectionTime);
          }
        }}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: colors.border,
            width: 40,
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 15,
            backgroundColor: colors.sheetBackground,
          },
        }}>
        <ScrollView style={styles.bottomSheetContent}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: "10%"}}>
            <TouchableOpacity
              onPress={() => timeSheetRef.current.close()}
              style={styles.arrowtouchable}>
              <Icon name="arrowleft" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>Select Collection Time</Text>
          </View>

          {/* Date Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'today' && styles.activeTab]}
              onPress={() => setActiveTab('today')}>
              <Text style={[styles.tabText, { color: colors.text }]}>Today</Text>
              <Text style={[styles.tabDate, { color: colors.text }]}>{format(new Date(), 'd MMMM yyyy')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'tomorrow' && styles.activeTab]}
              onPress={() => setActiveTab('tomorrow')}>
              <Text style={[styles.tabText, { color: colors.text }]}>Tomorrow</Text>
              <Text style={[styles.tabDate, { color: colors.text }]}>{format(addDays(new Date(), 1), 'd MMMM yyyy')}</Text>
            </TouchableOpacity>
          </View>

          {/* Time Slots Scroll View */}
          <ScrollView style={styles.timeScrollView}>
            {timeSlots.map((slot, index) => {
              const isSelected = selectedTimeSlot && selectedTimeSlot.getTime() === slot.getTime();
              return (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.timeSlot, 
                    isSelected && [
                      styles.selectedTimeSlot,
                      { backgroundColor: colors.card }
                    ]
                  ]}
                  onPress={() => setSelectedTimeSlot(slot)}>
                  <Text style={[
                    styles.timeText,
                    { 
                      color: colors.text,
                    },
                    isSelected && [
                      styles.selectedTimeText,
                      { color: 'red' }
                    ]
                  ]}>
                    {format(slot, 'h:mm a')}
                  </Text>
                  
                  <View style={styles.radioButtonContainer}>
                    <View style={[
                      styles.radioButtonOuter,
                      { 
                        borderColor: isSelected ? 'red' : colors.border 
                      }
                    ]}>
                      {isSelected && (
                        <View style={[
                          styles.radioButtonInner,
                          { backgroundColor: 'red' }
                        ]} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.bottomSheetButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.card }]}
              onPress={closeBottomSheet}>
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.headerBg }]}
              onPress={handleTimeSelect}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>

      {/* ORDER SUMMARY BOTTOM SHEET */}
      <RBSheet
        ref={orderSummarySheetRef}
        height={1000}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={false}
            closeOnPressBack={true} 
        draggable={true}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          draggableIcon: { 
            backgroundColor: colors.border, 
            width: 40 
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 15,
            backgroundColor: colors.sheetBackground,
          },
        }}>
        <View style={styles.bottomSheetContent}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: "18%"}}>
            <TouchableOpacity
              onPress={() => orderSummarySheetRef.current.close()}
              style={styles.arrowtouchable}>
              <Icon name="arrowleft" size={30} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>Your items from</Text>
          </View>

          <View style={styles.restaurantInfo}>
            <Image
              source={{
                uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo_67365fe19d901.jpeg',
              }}
              style={[styles.smallLogo, { backgroundColor: colors.card }]}
            />
            <View style={styles.restaurantText}>
              <Text style={[styles.restaurantTitle, { color: colors.text }]}>Restaurant</Text>
              <Text style={[styles.restaurantTitle, { color: colors.text }]}>Pizzeria Dhillon</Text>
              <View style={{ paddingTop: 10 }}>
                <Text style={[styles.restaurantAddress, { color: colors.placeholder }]}>
                  RaiffeisenstraBe 16
                </Text>
                <Text style={[styles.restaurantAddress, { color: colors.placeholder }]}>
                  Griesheim 64347
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.divider }]} />

          <ScrollView style={styles.orderItems}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
            />
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text }]}>Subtotal</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>{subtotal.toFixed(2)} €</Text>
            </View>
            
            {isSpecialOfferEligible && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.text }]}>Discount (12%)</Text>
                <Text style={[styles.discountText, { color: colors.text }]}>
                  -{discountAmount.toFixed(2)} €
                </Text>
              </View>
            )}
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text }]}>Service Fee</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>{serviceFee.toFixed(2)} €</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text }]}>Deposit</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>{deposit.toFixed(2)} €</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.text }]}>Delivery Fee</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>{deliveryFee.toFixed(2)} €</Text>
            </View>
            
            <View style={[styles.totalSeparator, { borderColor: colors.divider }]} />
            
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalPrice, { color: colors.text }]}>{total.toFixed(2)} €</Text>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  Paymenttext: {
    textAlign: 'center',
    color: 'white',
    fontSize: moderateScale(20),
    flex: 1,
    fontWeight: 'bold',
    marginLeft: '-5%',
  },
  scrollview: {
    flex: 1,
  },
  titletext: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 15,
  },
  detailtext: {
    fontSize: moderateScale(19),
  },
  detailtext1: {
    fontSize: moderateScale(17),
  },
  icon: {
    alignSelf: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  detailsTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  bottomSheetContent: {
    padding: 10,
    paddingBottom: 25,


  },
  bottomSheetHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: moderateScale(16),
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    fontSize: moderateScale(16),
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {},
  saveButton: {},
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  lineview: {
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom:10,
    marginHorizontal: -50,
  },
  lineview1: {
    borderBottomWidth: 10,
    marginTop: 15,
    marginHorizontal: -50,
  },
  recievediscounttext: { 
    fontSize: moderateScale(18) 
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {},
  checkboxTextContainer: { flex: 1 },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 15,
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: 15,
  },
  restaurantName: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: moderateScale(14),
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantText: {
    marginLeft: 15,
    marginTop: 20,
  },
  restaurantTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  restaurantAddress: {
    fontSize: moderateScale(14),
  },
  separator: {
    height: 1,
    marginVertical: 0,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
    paddingVertical: 8,
    borderBottomWidth: 1,
    paddingHorizontal:8
  },
  itemQuantity: {
    fontSize: moderateScale(18),
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(17),
    fontWeight: '500',
  },
  itemSize: {
    fontSize: moderateScale(16),
    marginTop: 3,
  },
  itemOption: {
    fontSize: moderateScale(15),
    fontStyle: '',
    marginTop: 2,
  },
  itemNote: {
    fontSize: moderateScale(15),
    marginTop: 5,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    minWidth: "30%",
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  priceLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  priceLabel1: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  totalSeparator: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
  },
  orderpaytext: {
    textAlign: 'center',
    color: 'white',
    paddingVertical: 6,
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 20,
  },
  lowertext: {
    alignSelf: 'center',
    marginHorizontal: 15,
    fontSize: moderateScale(17),
  },
  viewlower: { marginTop: 20, marginBottom: 30 },
  underlinedText: {
    textDecorationLine: 'underline',
  },
  smallLogo: {
    height: 60,
    width: 60,
    padding: 0,
    borderRadius: 10,
  },
  arrowtouchable: {},

  // New styles for time selection
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { 
    borderBottomColor: colors.headerBg,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
  },
  tabDate: {
    fontSize: moderateScale(13.5),
    marginTop: 4,
  },
  timeScrollView: {
    maxHeight: verticalScale(520),
  },
  timeSlot: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedTimeSlot: {},
  timeText: {
    fontSize: moderateScale(20),
  },
  selectedTimeText: {
    fontWeight: 'bold',
  },
  orderItems: {
    maxHeight: verticalScale(520),
  },
  itemQuantity1: {
    fontSize: moderateScale(13),
    marginTop: 3,
  },
  
  // Radio button styles
  radioButtonContainer: {
    // Removed margin to use space-between
  },
  radioButtonOuter: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    height: 9,
    width: 9,
    borderRadius: 6,
  },
});

export default Checkout;