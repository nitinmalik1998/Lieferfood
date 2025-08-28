

import {useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect, useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  FlatList,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker} from 'react-native-maps';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { useTheme } from '../State/ThemeContext'; // Adjust path as needed

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

// Dark map style
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

const Aboutus = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const markerRef = useRef(null);
  const [showFullText, setShowFullText] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { getColors } = useTheme();
  const colors = getColors();
  
  const [routes] = useState([
    {key: 'delivery', title: 'Delivery', icon: 'motorcycle'},
    {key: 'collection', title: 'Collection', icon: 'shopping-bag'},
  ]);

  const CustomTabBar = ({ navigationState, position, jumpTo }) => {
    return (
      <View style={[styles.tabBarContainer, {backgroundColor: colors.tabBg}]}>
        {routes.map((route, index) => {
          const isFocused = navigationState.index === index;
          
          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.tabItem,
                isFocused && styles.activeTab,
              ]}
              onPress={() => jumpTo(route.key)}
              activeOpacity={0.7}>
              <Icon1
                name={route.icon}
                size={22}
                color={isFocused ? 'red' : colors.icon}
              />
              <Text style={[
                styles.tabText,
                isFocused && styles.activeText,
                {color: isFocused ? 'red' : colors.text}
              ]}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Restaurant coordinates
  const restaurantLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  };

  const deliverydata = [
    {id: 1, day: 'Monday', time1: 'Closed', status: 'Closed'},
    {id: 2, day: 'Tuesday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {id: 3, day: 'Wednesday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {id: 4, day: 'Thursday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {id: 5, day: 'Friday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {id: 6, day: 'Saturday', time1: '12:00 - 23:00'},
    {id: 7, day: 'Sunday', time1: '12:00 - 23:00'},
  ];

  const collectiondata = [
    {id: 1, day: 'Monday', time1: 'Closed', status: 'Closed'},
    {id: 2, day: 'Tuesday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {
      id: 3,
      day: 'Wednesday',
      time1: '10:30 - 14:00',
      time2: '16:30 - 23:00',
    },
    {id: 4, day: 'Thursday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {id: 5, day: 'Friday', time1: '10:30 - 14:00', time2: '16:30 - 23:00'},
    {id: 6, day: 'Saturday', time1: '12:15 - 23:00'},
    {id: 7, day: 'Sunday', time1: '12:15 - 23:00'},
  ];

  const detail = [
    {
      restaurantname: 'Restaurant Pizzeria Dhillon',
      address1: 'RaiffeisentrateBe 16',
      address2: '64347 Griesheim',
      respresentative: 'Sulakhan Dhillon',
      email: 'info@lieferfood.com',
      fax: 496155830428,
      link: 'https://ec.europa.eu/consumers/odr',
    },
  ];

  const handleOpenGoogleMaps = () => {
    const {latitude, longitude} = restaurantLocation;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening Google Maps:', err),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (markerRef.current) markerRef.current.showCallout();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderScheduleItem = ({item}) => {
    // Get current day name
    const currentDay = new Date().toLocaleDateString('en-US', {weekday: 'long'});
    const isToday = item.day === currentDay;

    return (
      <View style={[styles.scheduleItem, {borderColor: colors.border}]}>
        <Text numberOfLines={1} style={[styles.dayText, {color: colors.text}]}>{item.day}</Text>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, isToday && styles.currentDayTime, {color: colors.text}]}>
            {item.time1}
          </Text>
          {item.time2 && (
            <Text style={[styles.timeText, isToday && styles.currentDayTime, {color: colors.text}]}>
              {item.time2}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderdetail = ({item}) => (
    <View>
      <Text style={[styles.remainingtext, {color: colors.text}]}>{item.restaurantname}</Text>
      <Text style={[styles.remainingtext1, {color: colors.text}]}>{item.address1}</Text>
      <Text style={[styles.remainingtext, {color: colors.text}]}>{item.address2}</Text>
      <Text style={[styles.remainingtext2, {color: colors.text}]}>Legal Respresentative</Text>
      <Text style={[styles.remainingtext3, {color: colors.text}]}>{item.respresentative}</Text>
      <Text style={[styles.remainingtext1, {color: colors.text}]}>Email : {item.email}</Text>
      <Text style={[styles.remainingtext, {color: colors.text}]}>Fax : {item.fax}</Text>
      <Text style={[styles.remainingtext1, {color: colors.text}]}>
        platform of the EU-Commission for online dispute
      </Text>
      <View style={{flexDirection: 'row', flexWrap: "wrap"}}>
        <Text style={[styles.resolutiontext, {color: colors.text}]}>resolution : </Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
          <Text style={[styles.link, {color: colors.linkColor}]}>{item.link}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const DeliverySchedule = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={deliverydata}
      renderItem={renderScheduleItem}
      keyExtractor={item => item.id.toString()}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );

  const CollectionSchedule = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={collectiondata}
      renderItem={renderScheduleItem}
      keyExtractor={item => item.id.toString()}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );

  const renderScene = SceneMap({
    delivery: DeliverySchedule,
    collection: CollectionSchedule,
  });

  const scheduleHeight = Math.max(
    deliverydata.length * verticalScale(85),
    collectiondata.length * verticalScale(85),
  );

  return (
    <View
      style={{
        paddingTop: insets.top, 
        flex: 1, 
        paddingBottom: insets.bottom,
        backgroundColor: colors.background
      }}>
      {/* Header Section */}
      <View style={[styles.header, {backgroundColor: colors.headerBg}]}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.businesstext}>Business Information</Text>
      </View>

      {/* Main Content */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={[styles.scrollview, {backgroundColor: colors.background}]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.titletext, {color: colors.text}]}>Where to find us</Text>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={restaurantLocation}
              scrollEnabled={true}
              zoomEnabled={true}
              customMapStyle={colors.background === '#121212' ? darkMapStyle : []}
              onMapReady={() => {
                setTimeout(() => markerRef.current?.showCallout(), 500);
              }}>
              <Marker
                ref={markerRef}
                coordinate={restaurantLocation}
                title="Restaurant Pizzeria Dhillon"
                description="Click pin location for delicious pizzas!"
                onPress={handleOpenGoogleMaps}
              />
            </MapView>
          </View>

          <View>
            <Text style={[styles.raifftext, {color: colors.text}]}>RaiffeisenstraBe 16</Text>
            <Text style={[styles.remainingtext, {color: colors.text}]}>Griesheim, 64347</Text>
          </View>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>

          <View>
            <Text style={[styles.titletext, {color: colors.text}]}>Cuisines</Text>
            <Text numberOfLines={2} style={[styles.remainingtext, {color: colors.text}]}>
              Italiensche Pizza, Burger, 2 fur 1 Deal
            </Text>
          </View>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>

          <View>
            <Text style={[styles.titletext, {color: colors.text}]}>A little bit about us</Text>
            <Text
              numberOfLines={showFullText ? undefined : 4}
              style={[styles.remainingtext, {color: colors.text}]}>
              Nestled in a vibrant neighborhood, this charming bistro blends
              modern elegance with rustic warmth. Exposed brick walls, soft
              pendant lighting, and lush greenery create an inviting, intimate
              atmosphere. The menu celebrates seasonal, locally sourced
              ingredients, offering bold flavors in dishes like truffle-infused
              risotto, seared scallops with citrus glaze, and house-smoked BBQ
              ribs
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullText(!showFullText)}
              style={styles.showMoreButton}>
              <Text style={[styles.showMoreText, {color: colors.linkColor}]}>
                {showFullText ? 'Show less' : 'Show more'}
              </Text>
              <Icon
                name={showFullText ? 'up' : 'down'}
                size={18}
                color={colors.linkColor}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>

          {/* Opening Times Section */}
          <View style={styles.tabContainer}>
            <Text style={[styles.titletext, {color: colors.text}]}>Opening times</Text>
            <TabView
              navigationState={{index: tabIndex, routes}}
              renderScene={renderScene}
              onIndexChange={setTabIndex}
              initialLayout={{
                width: Dimensions.get('window').width,
                height: scheduleHeight,
              }}
              style={{height: scheduleHeight}}
              renderTabBar={props => <CustomTabBar {...props} />}
            />
          </View>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>
          <View>
            <Text style={[styles.titletext, {color: colors.text}]}>Colophon</Text>
            <FlatList data={detail} renderItem={renderdetail} />
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${detail[0].email}`)}>
            <Text style={[styles.email, {color: colors.linkColor}]}>Send us an email</Text>
          </TouchableOpacity>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>
          <Text numberOfLines={4} style={[styles.bottomlasttext, {color: colors.text}]}>
            We are a professional trader.{' '}
            <TouchableOpacity onPress={() => Linking.openURL('your-url-here')}>
              <Text style={{textDecorationLine: "underline", color: colors.linkColor}}>
                Learn more
              </Text>
            </TouchableOpacity>{' '}
            about how we and Lieferfood split responsibilities to consumers.
          </Text>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>
          <Text style={[styles.email, {color: colors.linkColor}]}>Report a legal concern</Text>
          <View style={[styles.lineview, {borderColor: colors.border}]}></View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  businesstext: {
    textAlign: 'center',
    color: 'white',
    fontSize: moderateScale(19),
    flex: 1,
    fontWeight: 'bold',
    marginRight: 28,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    flexGrow: 1,
  },
  titletext: {
    marginTop: 15,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: 15,
  },
  mapContainer: {
    height: 250,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  raifftext: {fontSize: moderateScale(16), fontWeight: 'bold'},
  remainingtext: {fontSize: moderateScale(15)},
  lineview: {
    borderBottomWidth: 1,
    marginTop: 15,
    marginHorizontal: -20,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  showMoreText: {
    fontSize: moderateScale(17),
    fontWeight: '500',
    marginRight: 5,
  },
  arrowIcon: {
    marginTop: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dayText: {
    fontSize: moderateScale(14),
    width: '40%',
    fontWeight: "500"
  },
  timeContainer: {
    width: '40%',
    alignItems: "flex-end"
  },
  timeText: {
    fontSize: moderateScale(13),
  },
  currentDayTime: {
    color: 'green',
    fontWeight: '600',
    fontSize: moderateScale(13),
  },
  listContainer: {
    paddingBottom: 20,
  },
  tabContainer: {
    marginBottom: 0,
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    borderRadius: 10,
  },
  indicator: {
    backgroundColor: 'red',
    height: 2,
  },
  label: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  space: {marginTop: 50},
  remainingtext1: {marginTop: 20, fontSize: moderateScale(15)},
  remainingtext2: {marginTop: 20, fontSize: moderateScale(14.5), fontWeight: "500", flexShrink: 1},
  remainingtext3: { fontSize: moderateScale(14.5), fontWeight: "500", flexShrink: 1},
  email: {
    marginTop: 20,
    fontSize: moderateScale(15),
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  resolutiontext: {
    fontSize: moderateScale(15),
  },
  link: {
    fontSize: moderateScale(15),
    textDecorationLine: 'underline',
  },
  bottomlasttext: {fontSize: moderateScale(15), marginTop: 20, marginBottom: 10},
  
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  
  tabBarContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'red',
  },
  tabText: {
    marginLeft: 8,
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  activeText: {
    color: 'red',
  },

});

export default Aboutus;