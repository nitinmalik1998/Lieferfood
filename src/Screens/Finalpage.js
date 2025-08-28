// Finalpage.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import MapView, { Marker, Polyline } from 'react-native-maps';
import BottomSheet from 'react-native-raw-bottom-sheet';
import { useCart } from '../State/CartContext';
import { useTheme } from '../State/ThemeContext'; // Import useTheme

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => 
  Math.round(size + (scale(size) - size) * factor);

// Dark map style configuration
const darkMapStyle = [
 {
    "elementType": "geometry",
    "stylers": [
      {"color": "#242f3e"}
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#746855"}
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {"color": "#242f3e"}
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#d59563"}
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#d59563"}
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {"color": "#38414e"}
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {"color": "#212a37"}
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#9ca5b3"}
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {"color": "#746855"}
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {"color": "#1f2835"}
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {"color": "#17263c"}
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#515c6d"}
    ]
  }
];

const Finalpage = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomSheetRef = useRef(null);
  const findOutMoreSheetRef = useRef(null);
  
  // Get theme colors
  const { getColors } = useTheme();
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

  // Coordinates
  const [restaurantLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    title: 'Restaurant Pizzeria Dhillon ',
    description: 'Your food is being prepared here',
  });

  const [userLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    title: 'Your Location',
    description: 'Your food will be delivered here',
  });

  // Route coordinates
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState('3.5 km');
  const [duration, setDuration] = useState('15 mins');

  // Render cart items
  const renderCartItem = ({ item, index }) => (
    <View style={[styles.itemRow, { borderBottomColor: colors.divider }]} key={item.id}>
      <Text style={[styles.itemIndex, { color: colors.text }]}>{index + 1}.</Text>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemQuantity, { color: "grey" }]}>(Quantity: {item.quantity})</Text>
        {item.size && <Text style={[styles.itemSize, { color: colors.text }]}>{item.size}</Text>}
        
        {item.options && item.options.length > 0 && (
          <View>
            {item.options.map((option, idx) => (
              <Text key={idx} style={[styles.itemOption, { color: "grey" }]}>
                + {option.name}
              </Text>
            ))}
          </View>
        )}
        
        {item.note && (
          <Text style={[styles.itemNote, { color: colors.text }]}>Note: {item.note}</Text>
        )}
      </View>
      <Text style={[styles.itemPrice, { color: colors.text }]}>
        {((item.basePrice + item.optionsTotal) * item.quantity).toFixed(2)} €
      </Text>
    </View>
  );

  // Simulate getting route from Directions API
  useEffect(() => {
    const generateSimulatedRoute = (start, end, points) => {
      const route = [start];
      for (let i = 1; i < points; i++) {
        const fraction = i / points;
        const lat = start.latitude + (end.latitude - start.latitude) * fraction;
        const lng =
          start.longitude + (end.longitude - start.longitude) * fraction;

        const curveFactor = 0.002;
        const curvedLat = lat + curveFactor * Math.sin(fraction * Math.PI);
        const curvedLng = lng + curveFactor * Math.sin(fraction * Math.PI);

        route.push({
          latitude: curvedLat,
          longitude: curvedLng,
        });
      }
      route.push(end);
      return route;
    };

    const simulatedRoute = generateSimulatedRoute(
      restaurantLocation,
      userLocation,
      15
    );
    setRouteCoordinates(simulatedRoute);
  }, []);

  // Calculate map region to fit both locations
  const getMapRegion = () => {
    const padding = 0.01;
    const latDelta =
      Math.abs(restaurantLocation.latitude - userLocation.latitude) + padding;
    const longDelta =
      Math.abs(restaurantLocation.longitude - userLocation.longitude) + padding;

    return {
      latitude: (restaurantLocation.latitude + userLocation.latitude) / 2,
      longitude: (restaurantLocation.longitude + userLocation.longitude) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    };
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background,
      }}>
      {/* Map view */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={getMapRegion()}
          provider="google"
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsTraffic={true}
          showsBuildings={true}
          customMapStyle={colors.background === '#121212' ? darkMapStyle : []}>
          {/* Restaurant Marker */}
          <Marker
            coordinate={restaurantLocation}
            title={restaurantLocation.title}
            description={restaurantLocation.description}>
            <View style={styles.restaurantMarker}>
              <Image
                source={{
                  uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo_67365fe19d901.jpeg',
                }}
                style={styles.smallLogo1}
              />
            </View>
          </Marker>

          {/* User Marker */}
          <Marker
            coordinate={userLocation}
            title={userLocation.title}
            description={userLocation.description}>
            <View style={[styles.userMarker, { backgroundColor: colors.icon === '#FFFFFF' ? '#4285F4' : '#FF0000' }]}>
              <Icon name="person" size={20} color="white" />
            </View>
          </Marker>

          {/* Route Polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FF0000"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>
      </View>

      {/* Find Out More Bottom Sheet */}
      <BottomSheet
        ref={findOutMoreSheetRef}
        height={"45%"}
        draggable={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 20,
            backgroundColor: colors.sheetBackground,
          },
          draggableIcon: {
            backgroundColor: colors.divider,
            marginTop: -5
          },
        }}>
        <ScrollView contentContainerStyle={[styles.findOutMoreContent, { backgroundColor: colors.sheetBackground }]}>
          <Text style={[styles.findOutMoreTitle, { color: colors.text }]}>Order Preparation & Delivery</Text>
          <Text style={[styles.findOutMoreText, { color: colors.text }]}>
            Our team is working hard to prepare your order. Here's what's happening:
          </Text>
          
          <View style={styles.infoItem}>
            <Icon name="time-outline" size={20} color="red" />
            <Text style={[styles.infoText, { color: colors.text }]}>Average preparation time: 25-30 minutes</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="bicycle" size={20} color="red" />
            <Text style={[styles.infoText, { color: colors.text }]}>Delivery partner will arrive by scooter/bike</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="alert-circle" size={20} color="red" />
            <Text style={[styles.infoText, { color: colors.text }]}>Contact us immediately if there's any issue</Text>
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => findOutMoreSheetRef.current.close()}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      {/* Order Details Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        height={'65%'}
        draggable={true}
         closeOnPressBack={true} 
        customStyles={{
          container: {
            maxHeight: 700,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            backgroundColor: colors.sheetBackground,
          },
          draggableIcon: {
            backgroundColor: colors.divider,
          },
        }}>
        <ScrollView contentContainerStyle={[styles.bottomSheetContent, { backgroundColor: colors.sheetBackground }]}>
          <View  style={{flexDirection:"row", gap:"5%", alignItems:"center", marginBottom: 5}}>
            <TouchableOpacity
              onPress={() => bottomSheetRef.current.close()} // FIXED: Changed timeSheetRef to bottomSheetRef
              style={styles.arrowtouchable}>
              <Icon2 name="arrowleft" size={28} color={colors.text} />
            </TouchableOpacity>
          <Text style={[styles.orderDetailsTitle, { color: colors.text }]}>Order Details</Text>
          </View>
          
          {/* Address Row */}
          <View style={styles.addressraw}>
            <Icon1 
              name="location-history" 
              size={moderateScale(24)} 
              color={colors.icon} 
            />
            <Text 
              style={[styles.addrestest, { color: colors.text }]}
              numberOfLines={2} 
              ellipsizeMode="tail"
            >
              RaiffeisenstraBe 16, Griesheim, 64347
            </Text>
          </View>
          
          <View style={[styles.thickSeparator, { borderColor: colors.divider }]}></View>
          
          {/* Restaurant Info */}
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <View>
              <Text numberOfLines={2} style={[styles.restaurantname, { color: colors.text }]}>
                Restaurant Pizzeria Dhillon
              </Text>
              <Text style={[styles.orderdetailtext, { color: "grey" }]}>Order no. XGBTDQ</Text>
            </View>
            <Image
              source={{
                uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo_67365fe19d901.jpeg',
              }}
              style={styles.smallLogo}
            />
          </View>
          <View style={[styles.thinSeparator, { borderColor: colors.divider }]}></View>
          
          {/* Cart Items */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            style={{marginTop: 15}}
          />
          
          {/* Price Breakdown */}
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>Subtotal</Text>
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
          
          <TouchableOpacity onPress={() => navigation.navigate("Pricereceipt")}>
            <Text style={[styles.receipttext, { color: colors.linkColor }]}>open your receipt</Text>
          </TouchableOpacity>
          
          <View style={[styles.thickSeparator, { borderColor: colors.divider }]}></View>
          
          <View>
            <Text style={[styles.somethingtext, { color: colors.text }]}>Something wrong?</Text>
            <Text style={{ color: colors.text }}>Our virtual assistant can help.</Text>
          </View>
          
          <TouchableOpacity style={styles.startChatButton}>
            <Text style={styles.startChatText}>Start Chat</Text>
          </TouchableOpacity>
          
          <View style={[styles.thickSeparator, { borderColor: colors.divider }]}></View>
        </ScrollView>
      </BottomSheet>

      {/* Order info card */}
      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="red" />
          </TouchableOpacity>

          <View style={styles.deliveryInfo}>
            <View>
              <Text style={[styles.estimated, { color: colors.text }]}>Estimated delivery time</Text>
              <Text style={[styles.time, { color: colors.text }]}>{duration}</Text>
            </View>
            <View style={[styles.distanceBadge, { backgroundColor: "#ddd6" }]}>
              <Text style={[styles.distanceText, { color: "" }]}>{distance}</Text>
            </View>
          </View>

          {/* Order Status Section */}
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={styles.statusHeader}
              onPress={() => setIsExpanded(!isExpanded)}>
              <View style={styles.statusHeaderContent}>
                <View style={styles.dotContainer}>
                  <View style={[styles.dot, { backgroundColor: colors.headerBg }]} />
                  {isExpanded && <View style={[styles.verticalLine, { backgroundColor: colors.divider }]} />}
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.thanksText, { color: colors.text }]}>Thanks for your order</Text>
                  <Text style={[styles.subText, { color: colors.text }]}>
                    We've received your order{'\n'}and we're on it.
                  </Text>
                </View>
                <Icon
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={moderateScale(23)}
                  color={colors.text}
                  style={[styles.chevron, { backgroundColor: colors.card1 }]}
                />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.statusItem}>
                  <View style={styles.statusItemContent}>
                    <View style={styles.dotContainer}>
                      <View style={[styles.dot, styles.greyDot, { backgroundColor: colors.divider }]} />
                      <View style={[styles.verticalLine, { backgroundColor: colors.divider }]} />
                    </View>
                    <View style={styles.statusTextContainer}>
                      <Text style={[styles.statusTitle, { color: colors.text }]}>
                        Preparing and delivering
                      </Text>
                    <TouchableOpacity onPress={() => findOutMoreSheetRef.current.open()}>
                      <Text style={[styles.subText, styles.decorativeText, { color: colors.linkColor }]}>
                        Find out more?
                      </Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.statusItem}>
                  <View style={styles.statusItemContent}>
                    <View style={styles.dotContainer}>
                      <View style={[styles.dot, styles.greyDot, { backgroundColor: colors.divider }]} />
                    </View>
                    <Text style={[styles.statusTitle, { color: colors.text }]}>Delivered</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.orderDetailsButton, {bottom: insets.bottom + 20, backgroundColor: colors.headerBg}]}
        onPress={() => bottomSheetRef.current.open()}>
        <Text style={styles.buttonText}>Order Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Map styles
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  restaurantMarker: {},
  userMarker: {
    padding: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cardContainer: {
    position: 'absolute',
    top: '4%',
    left: 0,
    right: 0,
    marginHorizontal: 10
  },
  card: {
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderColor: 'lightgrey',
    padding: 2,
    marginBottom: 8,
    marginTop: 15,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  estimated: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    paddingVertical: 0,
  },
  time: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  distanceBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  distanceText: {
    fontWeight: '600',
  },
  statusContainer: {
    paddingBottom: verticalScale(15),
  },
  statusHeader: {
    paddingVertical: verticalScale(8),
  },
  thanksText: {
    fontSize: moderateScale(16.5),
    fontWeight: 'bold',
    marginBottom: verticalScale(2),
  },
  subText: {
    fontSize: moderateScale(12.5),
  },
  chevron: {
    borderRadius: moderateScale(20),
    padding: moderateScale(4),
    marginTop: verticalScale(4),
  },
  expandedContent: {
    marginTop: verticalScale(10),
    paddingLeft: moderateScale(0),
  },
  statusItem: {
    marginBottom: 0,
  },
  statusTitle: {
    fontWeight: '500',
    fontSize: moderateScale(15),
  },
  decorativeText: {
    textDecorationLine: 'underline',
  },
  dotContainer: {
    width: moderateScale(30),
    alignItems: 'center',
    paddingTop: verticalScale(4),
  },
  dot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(6),
  },
  greyDot: {},
  verticalLine: {
    width: moderateScale(2),
    height: verticalScale(40),
    marginVertical: verticalScale(4),
  },
  statusHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusTextContainer: {
    flex: 1,
    marginRight: moderateScale(15),
  },
  statusItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  bottomSheetContent: {
    paddingHorizontal: 15,
    paddingBottom: 50,
  },
  orderDetailsTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    
  },
  orderDetailsButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 11,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  arrowtouchable: { // Added missing style
    padding: 5,
    marginRight: 5,
  },
  addressraw: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    paddingHorizontal: moderateScale(1),
    marginBottom: verticalScale(10),
  },
  addrestest: {
    fontSize: moderateScale(14.5),
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  restaurantname: {
    fontSize:moderateScale(16),
    fontWeight: '600',
    flexShrink:1,
  },
  orderdetailtext: {
    fontSize:moderateScale(13),
  },
  smallLogo: {
    height:50,
    width:50
  },
  pizzatext: {
    fontSize:moderateScale(16),
    fontWeight:"500"
  },
  pizzasubtext: {
    fontSize:moderateScale(13.5),
  },
  pizzasubtext1: {
    fontSize:moderateScale(14.5),
    fontWeight:"500"
  },
  pricetext: {
    fontSize:moderateScale(16),
    alignSelf:"center"
  },
  paidtext: {
    fontSize:moderateScale(15.5),
    fontWeight:"600"
  },
  pricetext1: {
    fontSize:moderateScale(16),
    fontWeight:"bold"
  },
  receipttext: {
    marginTop:10,
    textDecorationLine:"underline",
    fontSize:moderateScale(15)
  },
  somethingtext: {
    fontSize:moderateScale(16.5),
    fontWeight:"bold"
  },
  startChatButton: {
    backgroundColor: 'red',
    paddingVertical: 7,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  startChatText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  smallLogo1: {
    height:45,
    width:45,
    borderRadius:30
  },
  findOutMoreContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  findOutMoreTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: 15,
  },
  findOutMoreText: {
    fontSize: moderateScale(16),
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: moderateScale(15),
    flex: 1,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 7,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  // Cart item styles
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  itemIndex: {
    fontSize: moderateScale(18),
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: moderateScale(13),
    marginTop: 3,
  },
  itemSize: {
    fontSize: moderateScale(16),
    marginTop:3,
  },
  itemOption: {
    fontSize: moderateScale(14),
    marginTop: 2,
  },
  itemNote: {
    fontSize: moderateScale(15),
    marginTop: 5,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    minWidth: 0,
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  priceLabel: {
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
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  thickSeparator: {
    borderWidth: 6,
    marginVertical: 15,
    marginHorizontal: -15,
  },
  thinSeparator: {
    borderWidth: 0.3,
    marginVertical: 8,
    marginTop:18,
    marginHorizontal:-20
  },
});

export default Finalpage;