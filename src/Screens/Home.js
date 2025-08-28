// Home.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  useWindowDimensions,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../State/CartContext';
import { startSpeechToText } from 'react-native-voice-to-text';
import { useTheme } from '../State/ThemeContext';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const Home = ({ navigation, route }) => {
  const { height, width } = useWindowDimensions();
  const { theme, getColors } = useTheme();
  const colors = getColors();
  const [isOn, setIsOn] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState();
  const [vendorsData, setVendorsData] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCouponData, setFilteredCouponData] = useState(
    vendorsData?.vendors || [],
  );
  const [showSearchBar, setShowSearchBar] = useState(false);
  const flatListRef = useRef(null);
  const [address, setAddress] = useState('Sector-65 Tower A 11/5 Suntech office, Noida');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const voiceRecognitionActive = useRef(false);
  
  // Get cart count from context
  const { totalItemsCount } = useCart();

  const insets = useSafeAreaInsets();
  const cartBottomPosition = height * 0.04;

  // Voice recognition functions
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

  // User ID handling
  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('Id');
      setUserId(id);
      return id != null ? JSON.parse(id) : null;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) setUserId(id);
    };
    fetchUserId();
  }, []);

  // Restaurant data fetching
  useEffect(() => {
    restaurantData();
  }, [userId]);

  const restaurantData = async () => {
    const formData = new FormData();
    formData.append('user_id', userId);

    try {
      const response = await axios.post(
        'https://argosmob.uk/dhillon/public/api/v1/shop/all',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setVendorsData(response?.data?.data);
      setisLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setisLoading(false);
    }
  };

  // Address handling
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('userAddress');
        if (savedAddress) setAddress(savedAddress);
      } catch (e) {
        console.log('Error loading address:', e);
      }
    };
    loadAddress();
  }, []);

  useEffect(() => {
    if (route.params?.updatedAddress) {
      setAddress(route.params.updatedAddress);
    }
  }, [route.params?.updatedAddress]);

  // Category rendering
  const renderCategoryList = ({ item, index }) => {
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
      <TouchableOpacity onPress={handlePress} style={styles(colors).categoryItem}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item?.image && item.image !== 'https://via.placeholder.com/300'
              ? `https://argosmob.uk/dhillon/public/uploads/category/${item.image}`
              : 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg' 
            }}
            style={[
              styles(colors).categoryImage,
              isSelected && { borderWidth: 2, borderColor: 'green' }
            ]}
            resizeMode="contain"
          />
          {isSelected && (
            <FontAwesome
              name="check-circle"
              size={22}
              color="green"
              style={styles(colors).checkIcon}
            />
          )}
        </View>
        <Text style={[styles(colors).categoryText, isSelected && { color: 'green', fontWeight: 'bold' }]}>
          {item?.name?.length > 7 ? `${item.name.slice(0, 7)}...` : item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Restaurant rendering
  const renderRestaurants = ({ item, index }) => {
    const isSelected = selectedItems.includes(item.id);
    const toggleSelection = async () => {
      const updatedSelectedItems = isSelected
        ? selectedItems.filter(itemId => itemId !== item.id)
        : [...selectedItems, item.id];
      setSelectedItems(updatedSelectedItems);

      try {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('vendor_id', item.id);
        await axios.post(
          'https://argosmob.uk/dhillon/public/api/v1/favorite/add-in-favorite',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
    };

    const shouldRender = 
      (isOn && item.vendor_details?.isDelivery === 1) || 
      (!isOn && item.vendor_details?.isPickup === 1);

    if (!shouldRender) return null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('About Restaurant', { item, id: item.id })}
        style={styles(colors).restaurantCard}
      >
        <View>
          <Image
            source={{ uri: `https://argosmob.uk/dhillon/public/uploads/users/${item?.profile}` }}
            style={styles(colors).restaurantImage}
          />
          <TouchableOpacity 
            style={[styles(colors).heartIcon, { backgroundColor: colors.heartBackground }]} 
            onPress={toggleSelection}
          >
            <FontAwesome
              name={isSelected ? 'heart' : 'heart-o'}
              size={22}
              color={isSelected ? 'red' : colors.white}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: `https://argosmob.uk/dhillon/public/uploads/logo/${item?.vendor_details?.logo}` }}
            style={styles(colors).logoImage}
          />
        </View>
        <View style={styles(colors).restaurantDetails}>
          <Text style={styles(colors).name}>{item?.name}</Text>
          
          <View style={styles(colors).ratingContainer}>
            <View style={styles(colors).ratingSection}>
              <Entypo name="star" size={16} color="red" />
              <Text style={styles(colors).ratings}>{parseFloat(item?.average_rating).toFixed(1)}</Text>
              <Text style={styles(colors).reviews}>
                ({parseInt(item?.total_reviews) || 'No Rating'})
              </Text>
            </View>
            
            {item?.vendor_details?.restuarnat_title && (
              <Text style={styles(colors).deliveryTime}>
                {item.vendor_details.restuarnat_title}
              </Text>
            )}
          </View>

          <View style={styles(colors).infoContainer}>
            <View style={styles(colors).infoRow}>
              <MaterialIcons name="access-time-filled" size={15} color={colors.text} />
              <Text style={styles(colors).deliveryTime}>
                {item?.vendor_details?.min_prepare_time}-{item?.vendor_details?.max_prepare_time} min
              </Text>
            </View>
            
            <View style={styles(colors).priceInfo}>
              <View style={styles(colors).infoRow}>
                <Ionicons name="bag" size={15} color={colors.text} />
                <Text style={styles(colors).deliveryTime}>
                  Min {item?.vendor_details?.minimum_price}
                </Text>
                <MaterialIcons name="euro" size={15} color={colors.text} />
              </View>

              <View style={[styles(colors).infoRow, { marginLeft: '2%' }]}>
                <MaterialIcons name="motorcycle" size={21} color={colors.text} />
                <Text style={styles(colors).deliveryTime}>
                  {item?.vendor_details?.delivery_cost}
                </Text>
                <MaterialIcons name="euro" size={15} color={colors.text} />
                <Text style={styles(colors).deliveryTime}>Delivery</Text>
              </View>
            </View>
          </View>

          {item?.isOffer && (
            <View style={styles(colors).offerContainer}>
              <MaterialIcons name="local-offer" size={15} color="red" />
              <Text style={[styles(colors).deliveryTime, { color: colors.text, marginLeft: 3 }]}>
                {item.offers?.[0]?.title}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Search functionality
  const handleSearch = term => {
    setSearchTerm(term);
    const filteredItems = vendorsData?.vendors?.filter(item =>
      item?.name?.toLowerCase().includes(term.toLowerCase())
    ) || [];
    setFilteredCouponData(filteredItems);
  };

  // Header components
  const RestaurantListHeader = () => (
    <View>
      <View style={styles(colors).headerTop}>
        <Text style={styles(colors).findFlavourText}>Find your flavour</Text>
        <TouchableOpacity onPress={() => setShowSearchBar(true)}>
          <FontAwesome name="search" size={22} color="red" style={styles(colors).headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
          <FontAwesome name="sliders" size={22} color="red" style={styles(colors).headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Seeall')}>
          <Text style={styles(colors).seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles(colors).categoryContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={vendorsData?.categories}
          renderItem={renderCategoryList}
          keyExtractor={item => item?.id.toString()}
        />
      </View>
    </View>
  );

  const SearchHeader = () => (
    <View style={styles(colors).searchHeader}>
      <TouchableOpacity onPress={() => setShowSearchBar(false)} style={styles(colors).backButton}>
        <Ionicons name="arrow-back" size={27} color="red" />
      </TouchableOpacity>
      
      <TextInput
        style={[styles(colors).searchInput, { backgroundColor: colors.card }]}
        placeholder="Search Restaurant Name"
        placeholderTextColor={colors.placeholder}
        value={searchTerm}
        onChangeText={handleSearch}
        autoFocus={true}
      />
      
      <TouchableOpacity 
        onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
        style={styles(colors).voiceButton}
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isLoading ? (
        <View>
          {[...Array(4)].map((_, i) => (
            <ShimmerPlaceholder
              key={i}
              style={styles(colors).shimmerCard}
              shimmerColors={[colors.shimmer1, colors.shimmer2, colors.shimmer3]}
            />
          ))}
        </View>
      ) : (
        <SafeAreaView style={{  
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        }}>
          {showSearchBar ? (
            <SearchHeader />
          ) : (
            <View style={[styles(colors).mainHeader, { backgroundColor: colors.background }]}>
              <View style={styles(colors).addressContainer}>
                <TouchableOpacity
                  onPress={() => 
                    navigation.navigate('Locationsearch', { 
                      currentAddress: address,
                      onAddressUpdate: (newAddress) => setAddress(newAddress)
                    })
                  }
                >
                  <Text style={styles(colors).address}>
                    {address?.length > 20 ? `${address.slice(0, 20)}...` : address}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Locationsearch')}>
                  <Entypo name="chevron-down" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles(colors).toggleContainer}>
                <TouchableOpacity
                  style={[styles(colors).toggleButton, { borderColor: colors.border }]}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    setIsOn(!isOn);
                  }}
                >
                  <View style={[
                    styles(colors).toggleActive, 
                    isOn 
                      ? { backgroundColor: colors.toggleActive } 
                      : { backgroundColor: colors.toggleInactive }
                  ]}>
                    {isOn ? (
                      <View style={styles(colors).toggleContent}>
                        <MaterialIcons name="motorcycle" size={20} color="red" />
                        <Text style={styles(colors).toggleText}>Delivery</Text>
                      </View>
                    ) : (
                      <View style={styles(colors).toggleContent}>
                        <MaterialIcons name="local-mall" size={18} color="red" />
                        <Text style={styles(colors).toggleText}>Pickup</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles(colors).toggleIcon, { backgroundColor: colors.card }]}>
                    {isOn ? (
                      <MaterialIcons name="local-mall" size={18} color={colors.text} />
                    ) : (
                      <MaterialIcons name="motorcycle" size={18} color={colors.text} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <FlatList
            contentContainerStyle={{ 
              paddingTop: showSearchBar ? 0 : 0,
              paddingBottom: "15%",
              backgroundColor: colors.background,
            }}
            showsVerticalScrollIndicator={false}
            data={showSearchBar ? filteredCouponData : vendorsData?.vendors}
            renderItem={renderRestaurants}
            keyExtractor={item => item?.id.toString()}
            ListHeaderComponent={showSearchBar ? null : RestaurantListHeader}
          />
        </SafeAreaView>
      )}
      
      {/* Floating Cart Icon */}
      {!isLoading && totalItemsCount > 0 && (
        <TouchableOpacity 
          style={[styles(colors).cartIconContainer, { bottom: cartBottomPosition }]}
          onPress={() => navigation.navigate('Cart')}
        >
          <FontAwesome6 name="basket-shopping" size={26} color="white" />
          <View style={styles(colors).badge}>
            <Text style={styles(colors).badgeText}>{totalItemsCount}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = (colors) => StyleSheet.create({
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'orange',
    gap: '1%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginLeft: '1.5%'
  },
  address: {
    color: colors.text,
    fontFamily: 'Poppins-Medium',
    fontSize: 12.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  toggleContainer: {
    backgroundColor: colors.card,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: "15%"
  },
  toggleButton: {
    height: 40,
    width: 140,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  toggleActive: {
    height: '100%',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 15,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    color: colors.text,
    fontSize: 13.5,
    fontWeight: '600',
    marginLeft: 2,
  },
  toggleIcon: {
    height: '100%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    color: colors.text,
  },
  restaurantCard: {
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
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
    color: colors.text,
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
    color: colors.text,
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
    color: colors.text,
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
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16.5,
    borderRadius: 10,
    paddingHorizontal: 15,
  marginVertical:10,
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
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 15,
  },
  headerIcon: {
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  seeAllText: {
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 15,
    paddingTop: 10,
    textDecorationLine: 'underline',
  },
  shimmerCard: {
    height: 200,
    borderWidth: 0,
    margin: 20,
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
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