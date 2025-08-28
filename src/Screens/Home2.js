import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  Dimensions,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../State/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startSpeechToText } from 'react-native-voice-to-text';

export const Home = ({navigation, route}) => {
  const {height, width} = Dimensions.get('window');
  const [isOn, setIsOn] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const flatListRef = useRef(null);
  const [address, setAddress] = useState('123 Main Street, New York, NY');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const voiceRecognitionActive = useRef(false);
  
  const { totalItemsCount } = useCart();
  const insets = useSafeAreaInsets();

  // Calculate bottom position for cart icon (8% above screen bottom)
  const cartBottomPosition = height * 0.045;

  const startVoiceRecognition = async () => {
    setIsListening(true);
    voiceRecognitionActive.current = true;

    try {
      const result = await startSpeechToText();
      if (voiceRecognitionActive.current) {
        setSearchTerm(result);
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
    } finally {
      setIsListening(false);
      voiceRecognitionActive.current = false;
    }
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
    voiceRecognitionActive.current = false;
  };

  useEffect(() => {
    return () => {
      stopVoiceRecognition();
    };
  }, []);

  useEffect(() => {
    if (!showSearchBar) {
      stopVoiceRecognition();
    }
  }, [showSearchBar]);

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('userSelectedAddress');
        if (savedAddress) {
          setAddress(savedAddress);
        }
      } catch (e) {
        console.error('Failed to load address', e);
      } finally {
        setIsInitializing(false);
      }
    };
    
    loadSavedAddress();
  }, []);

  useEffect(() => {
    const saveAddress = async () => {
      if (isInitializing) return;
      
      try {
        await AsyncStorage.setItem('userSelectedAddress', address);
      } catch (e) {
        console.error('Failed to save address', e);
      }
    };
    
    saveAddress();
  }, [address, isInitializing]);

  useEffect(() => {
    if (route.params?.updatedAddress) {
      setAddress(route.params.updatedAddress);
    }
  }, [route.params?.updatedAddress]);

  const staticCategories = [
    { id: 1, name: 'Shops', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
    { id: 2, name: 'Chinese', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
    { id: 3, name: 'Brazilian', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
    { id: 4, name: 'Sushi', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
    { id: 5, name: 'Salad', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
    { id: 6, name: 'Dessert', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
    { id: 7, name: 'Coffee', image: 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' },
  ];

  const staticRestaurants = [
    {
      id: 1,
      name: 'Restaurant Pizzeria Dhillon',
      profile: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg',
      vendor_details: {
        isDelivery: 1,
        isPickup: 1,
        logo: 'https://img.freepik.com/free-vector/bakery-logo-template_441059-125.jpg',
        min_prepare_time: 20,
        max_prepare_time: 30,
        minimum_price: 15,
        delivery_cost: 2,
        restuarnat_title: 'Italian'
      },
      average_rating: 4.5,
      total_reviews: 120,
      isOffer: true,
      offers: [{ title: '20% off on all pizzas' }]
    },
    {
      id: 2,
      name: 'Maharaja Restaurant',
      profile: 'https://img.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg',
      vendor_details: {
        isDelivery: 1,
        isPickup: 1,
        logo: 'https://img.freepik.com/free-vector/restaurant-logo_23-2147505140.jpg',
        min_prepare_time: 15,
        max_prepare_time: 25,
        minimum_price: 10,
        delivery_cost: 1.5,
        restuarnat_title: 'American'
      },
      average_rating: 4.2,
      total_reviews: 85,
      isOffer: false,
      offers: []
    },
    {
      id: 3,
      name: 'Sushi Sensation',
      profile: 'https://img.freepik.com/free-photo/side-view-sushi-rolls-with-chopsticks-plate_141793-14206.jpg',
      vendor_details: {
        isDelivery: 1,
        isPickup: 0,
        logo: 'https://img.freepik.com/free-vector/japanese-restaurant-logo_23-2147498790.jpg',
        min_prepare_time: 30,
        max_prepare_time: 45,
        minimum_price: 25,
        delivery_cost: 3,
        restuarnat_title: 'Japanese'
      },
      average_rating: 4.7,
      total_reviews: 150,
      isOffer: true,
      offers: [{ title: 'Free miso soup with order' }]
    },
    {
      id: 4,
      name: 'Pasta Paradise',
      profile: 'https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg',
      vendor_details: {
        isDelivery: 1,
        isPickup: 1,
        logo: 'https://img.freepik.com/free-vector/italian-restaurant-logo_23-2147498788.jpg',
        min_prepare_time: 25,
        max_prepare_time: 40,
        minimum_price: 18,
        delivery_cost: 2.5,
        restuarnat_title: 'Italian'
      },
      average_rating: 4.4,
      total_reviews: 95,
      isOffer: true,
      offers: [{ title: 'Buy 1 get 1 free pasta' }]
    },
    {
      id: 5,
      name: 'Pizzeria Rosario',
      profile: 'https://images6.alphacoders.com/412/412226.jpg',
      vendor_details: {
        isDelivery: 1,
        isPickup: 1,
        logo: 'https://img.freepik.com/free-vector/italian-restaurant-logo_23-2147498791.jpg',
        min_prepare_time: 25,
        max_prepare_time: 40,
        minimum_price: 18,
        delivery_cost: 2.5,
        restuarnat_title: 'Italian'
      },
      average_rating: 4.4,
      total_reviews: 95,
      isOffer: true,
      offers: [{ title: 'Buy 1 get 1 free pasta' }]
    }
  ];

  const vendorsData = {
    categories: staticCategories,
    vendors: staticRestaurants
  };

  const filteredCouponData = searchTerm 
    ? vendorsData.vendors.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : vendorsData.vendors;

  const renderCategoryList = ({item, index}) => {
    const isSelected = selectedCategories.includes(item.id);
    const handlePress = () => {
      setSelectedCategories(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id) 
          : [...prev, item.id]
      );
      flatListRef.current.scrollToIndex({ animated: true, index, viewPosition: 0.5 });
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.categoryItem}>
        <View style={{position: 'relative'}}>
          <Image
            source={{ uri: item.image }}
            style={[
              styles.categoryImage,
              isSelected && { borderWidth: 2, borderColor: 'red' }
            ]}
            resizeMode="contain"
          />
          {isSelected && (
            <FontAwesome
              name="check-circle"
              size={22}
              color="red"
              style={styles.checkIcon}
            />
          )}
        </View>
        <Text style={[styles.categoryText, isSelected && { color: 'red', fontWeight: 'bold', }]}>
          {item.name?.length > 7 ? `${item.name.slice(0,7)}...` : item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRestaurants = ({item, index}) => {
    const isSelected = selectedItems.includes(item.id);
    const toggleSelection = () => {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id) 
          : [...prev, item.id]
      );
    };

    const shouldRender = 
      (isOn && item.vendor_details?.isDelivery === 1) || 
      (!isOn && item.vendor_details?.isPickup === 1);

    if (!shouldRender) return null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('About Restaurant', { item })}
        style={styles.restaurantCard}
      >
        <View>
          <Image
            source={{ uri: item.profile }}
            style={styles.restaurantImage}
          />
          <TouchableOpacity style={styles.heartIcon} onPress={toggleSelection}>
            <FontAwesome
              name={isSelected ? 'heart' : 'heart-o'}
              size={22}
              color={isSelected ? 'red' : '#ccc'}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: item.vendor_details?.logo }}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.restaurantDetails}>
          <Text style={styles.name}>{item.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingSection}>
              <Entypo name="star" size={16} color="red" />
              <Text style={styles.ratings}>{item.average_rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>
                ({item.total_reviews || 'No Rating'})
              </Text>
            </View>
            
            {item.vendor_details?.restuarnat_title && (
              <Text style={styles.deliveryTime}>
                {item.vendor_details.restuarnat_title}
              </Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialIcons name="access-time-filled" size={15} color="black" />
              <Text style={styles.deliveryTime}>
                {item.vendor_details.min_prepare_time}-{item.vendor_details.max_prepare_time} min
              </Text>
            </View>
            
            <View style={styles.priceInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="bag" size={15} color="black" />
                <Text style={styles.deliveryTime}>
                  Min {item.vendor_details.minimum_price}
                </Text>
                <MaterialIcons name="euro" size={15} color="black" />
              </View>

              <View style={[styles.infoRow, { marginLeft: '2%' }]}>
                <MaterialIcons name="motorcycle" size={21} color="black" />
                <Text style={styles.deliveryTime}>
                  {item.vendor_details.delivery_cost}
                </Text>
                <MaterialIcons name="euro" size={15} color="black" />
                <Text style={styles.deliveryTime}>Delivery</Text>
              </View>
            </View>
          </View>

          {item.isOffer && (
            <View style={styles.offerContainer}>
              <MaterialIcons name="local-offer" size={15} color="red" />
              <Text style={[styles.deliveryTime, { color: 'black', marginLeft: 3 }]}>
                {item.offers[0]?.title}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = term => {
    setSearchTerm(term);
  };

  const RestaurantListHeader = () => (
    <View>
      <View style={styles.headerTop}>
        <Text style={styles.findFlavourText}>Find your flavour</Text>
        <TouchableOpacity onPress={() => setShowSearchBar(true)}>
          <FontAwesome name="search" size={22} color="red" style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
          <FontAwesome name="sliders" size={22} color="red" style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Seeall')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={vendorsData.categories}
          renderItem={renderCategoryList}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );

  const SearchHeader = () => (
    <View style={styles.searchHeader}>
      <TouchableOpacity onPress={() => setShowSearchBar(false)} style={styles.backButton}>
        <Ionicons name="arrow-back" size={27} color="red" />
      </TouchableOpacity>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search Restaurant Name"
        placeholderTextColor="grey"
        value={searchTerm}
        onChangeText={handleSearch}
        autoFocus={true}
      />
      
      <TouchableOpacity 
        onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
        style={styles.voiceButton}
      >
        {isListening ? (
          <ActivityIndicator size="small" color="red" />
        ) : (
          <Ionicons name="mic" size={24} color="red" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{  
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}>
        {showSearchBar ? (
          <SearchHeader />
        ) : (
          <View style={styles.mainHeader}>
            <View style={styles.addressContainer}>
              <TouchableOpacity
                onPress={() => 
                  navigation.navigate('Locationsearch', { 
                    currentAddress: address,
                    onAddressUpdate: (newAddress) => setAddress(newAddress)
                  })
                }
              >
                <Text style={styles.address}>
                  {address?.length > 20 ? `${address.slice(0,20)}...` : address}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Locationsearch')}>
                <Entypo name="chevron-down" size={22} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  setIsOn(!isOn);
                }}
              >
                <View style={[styles.toggleActive, isOn ? null : styles.toggleInactive]}>
                  {isOn ? (
                    <View style={styles.toggleContent}>
                      <MaterialIcons name="motorcycle" size={20} color="red" />
                      <Text style={styles.toggleText}>Delivery</Text>
                    </View>
                  ) : (
                    <View style={styles.toggleContent}>
                      <MaterialIcons name="local-mall" size={18} color="red" />
                      <Text style={styles.toggleText}>Pickup</Text>
                    </View>
                  )}
                </View>
                <View style={styles.toggleIcon}>
                  {isOn ? (
                    <MaterialIcons name="local-mall" size={18} color="black" />
                  ) : (
                    <MaterialIcons name="motorcycle" size={18} color="black" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          contentContainerStyle={{ 
            paddingBottom: 50,
            paddingTop: showSearchBar ? 0 : 0,  
          }}
          showsVerticalScrollIndicator={false}
          data={filteredCouponData}
          renderItem={renderRestaurants}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={showSearchBar ? null : RestaurantListHeader}
        />
      </SafeAreaView>
      
      {/* Floating Cart Icon positioned 8% above screen bottom */}
      <TouchableOpacity 
        style={[styles.cartIconContainer, {bottom: cartBottomPosition}]}
        onPress={() => navigation.navigate('Cart')}
      >
        <FontAwesome6 name="basket-shopping" size={26} color="white" />
        {totalItemsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItemsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'orange',
    gap: '1%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  address: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 12.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  toggleContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    flexGrow: 0,
    flexShrink: 0,
  },
  toggleButton: {
    height: 40,
    width: 140,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  toggleActive: {
    height: '100%',
    width: '70%',
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 15,
  },
  toggleInactive: {
    alignSelf: 'flex-start',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    color: 'black',
    fontSize: 13.5,
    fontWeight: '600',
    marginLeft: 2,
  },
  toggleIcon: {
    height: '100%',
    width: '30%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    backgroundColor: 'white',
    marginLeft: 10,
  },
  categoryItem: {
    padding: 5,
    marginHorizontal: 5,
    marginTop: 10,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  categoryImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  checkIcon: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  restaurantCard: {
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    
  },
  restaurantImage: {
    height: 150,
    resizeMode: 'stretch',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heartIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'rgba(52,52,52,0.4)',
    padding: 5,
    borderRadius: 20,
  },
  logoImage: {
    height: 30,
    width: 30,
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  restaurantDetails: {
    paddingVertical: 6,
    paddingHorizontal: '3%',
  },
  name: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexGrow: 0,
  },
  ratings: {
    color: 'red',
    fontFamily: 'Poppins-Medium',
    fontSize: 14.5,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  reviews: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 5,
  },
  infoContainer: {
    flexShrink: 1,
    flexGrow: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  deliveryTime: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 5,
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'black',
    fontSize: 16.5,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  voiceButton: {
    padding: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  findFlavourText: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 15,
  },
  headerIcon: {
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  seeAllText: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 15,
    paddingTop: 10,
    textDecorationLine: 'underline',
  },
  cartIconContainer: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'red',
    width: "15%",
    height: 55,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: 13,
    backgroundColor: 'white',
    borderRadius: 50,
    width: "50%",
    height: "50%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'red',
    fontSize: 13,
    fontWeight: 'bold',
  }
});