import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {useNavigation, useFocusEffect} from '@react-navigation/native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

 const SearchResto = ({navigation, route}) => {
  const {height, width} = Dimensions.get('window');
  const [isOn, setIsOn] = useState(true);
  const [select, setSelect] = useState(1);
  const [selectType, setSelectType] = useState('Italian style pizza');
  const [isLoading, setisLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState();
  const [vendorsData, setVendorsData] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [selectedOption, setSelectedOption] = useState('delivery');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCouponData, setFilteredCouponData] = useState(
    vendorsData?.vendors || [],
  );
  const [showSearchBar, setShowSearchBar] = useState(false);
  const flatListRef = useRef(null);
  const ID = route?.params?.id;

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('Id');
      console.log('ID:', id); // Log the retrieved ID
      setUserId(id); // Set the raw ID to state
      return id != null ? JSON.parse(id) : null; // Parse the ID if it's not null
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
      }
    };

    fetchUserId();
  }, []);

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
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setVendorsData(response?.data?.data);
      setisLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setisLoading(false);
    }
  };

  const getCustomerDetails = async () => {
    const formData = new FormData();
    formData.append('user_id', userId);

    try {
      const response = await axios.post(
        'https://argosmob.uk/dhillon/public/api/v1/customer/customer-details',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setCustomerDetails(response?.data?.data);
      console.log('Customer Details:', customerDetails);
      setisLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setisLoading(false);
    }
  };

  // Load saved address when screen focuses
  // Replace the existing address state and useEffect
  const [address, setAddress] = useState('Sector-65 Tower A 11/5 Suntech office, Noida');

  // Remove the entire useFocusEffect block and replace with:
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('userAddress');
        if (savedAddress) {
          setAddress(savedAddress);
        }
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

  // Change useState initialization to array
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Updated renderCategoryList function
  const renderCategoryList = ({item, index}) => {
    const handlePress = () => {
      setSelectedCategories(prev => {
        // Toggle category selection
        if (prev.includes(item.id)) {
          return prev.filter(id => id !== item.id);
        }
        return [...prev, item.id];
      });

      // Maintain scroll behavior
      flatListRef.current.scrollToIndex({
        animated: true,
        index,
        viewPosition: 0.5,
      });
    };

    const isSelected = selectedCategories.includes(item.id);

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          padding: 5,
          marginHorizontal: 5,
          marginTop: 10,
          paddingHorizontal: 5,
          borderRadius: 20,
          alignItems: 'center',
        }}>
        <View style={{position: 'relative'}}>
          <Image
            source={{
              uri:
                item?.image && item.image !== 'https://via.placeholder.com/300'
                  ? 'https://argosmob.uk/dhillon/public/uploads/category/' +
                    item.image
                  : 'https://img.freepik.com/free-vector/hand-drawn-pasta-cartoon-illustration_23-2150645133.jpg',
            }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              borderWidth: isSelected ? 2 : 0,
              borderColor: 'red',
            }}
            resizeMode="contain"
          />
          {isSelected && (
            <FontAwesome
              name="check-circle"
              size={22}
              color="red"
              style={{
                position: 'absolute',
                right: -5,
                bottom: -5,
                backgroundColor: 'white',
                borderRadius: 10,
              }}
            />
          )}
        </View>
        <Text
          style={{
            color: isSelected ? 'red' : 'black',
            fontWeight: isSelected ? 'bold' : '400',
            fontFamily: isSelected ? 'Poppins-SemiBold' : 'Poppins-Medium',
            fontSize: 12,
            marginTop: 5,
            textAlign: 'center',
          }}>
          {item?.name?.length > 7 ? item?.name.slice(0, 7) + '...' : item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRestaurants = ({item, index}) => {
    const isSelected = selectedItems.includes(item.id);
    // console.log("item :" ,item)

    const toggleSelection = async () => {
      // Prepare the updated selected items
      const updatedSelectedItems = isSelected
        ? selectedItems.filter(itemId => itemId !== item.id)
        : [...selectedItems, item.id];

      // Update the selected items state
      setSelectedItems(updatedSelectedItems);

      // Define the API endpoint
      const apiUrl =
        'https://argosmob.uk/dhillon/public/api/v1/favorite/add-in-favorite';

      // Prepare the form data
      const formData = new FormData();
      formData.append('user_id', userId); // Replace `userId` with the actual user ID
      formData.append('vendor_id', item.id); // Replace `item.id` with the actual vendor ID

      try {
        // Make the API call
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle the response
        console.log('API response:', response.data);

        // You can add additional logic if needed (e.g., show a success message)
      } catch (error) {
        // Handle any errors
        console.error('Error while making API call:', error);
      }
    };

    const Render =
      (isOn === true && item.vendor_details?.isDelivery === 1) ||
      (isOn === false && item.vendor_details?.isPickup === 1);

    if (!Render) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('About Restaurant', {item: item, id: item.id})
        }
        style={{
          marginHorizontal: 15,
          marginTop: index > 0 ? 10 : 10,
          borderRadius: 20,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 10,
        }}>
        <View>
          <Image
            source={{
              uri:
                'https://argosmob.uk/dhillon/public/uploads/users/' +
                item?.profile,
            }}
            style={{
              height: 150,
              overflow: 'hidden',
              resizeMode: 'stretch',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 5,
              top: 5,
              backgroundColor: 'rgba(52,52,52,0.4)',
              padding: 5,
              borderRadius: 20,
            }}
            onPress={toggleSelection}>
            <FontAwesome
              name={isSelected ? 'heart' : 'heart-o'}
              size={22}
              color={isSelected ? 'red' : '#ccc'}
            />
          </TouchableOpacity>
          <Image
            source={{
              uri:
                'https://argosmob.uk/dhillon/public/uploads/logo/' +
                item?.vendor_details?.logo,
            }}
            style={{
              height: 30,
              width: 30,
              borderRadius: 5,
              position: 'absolute',
              bottom: 10,
              left: 10,
            }}
          />
        </View>
        <View
          style={{
            
            borderTopWidth: 0,
            paddingVertical: 6,
            paddingHorizontal: '3%',
            borderColor: 'grey',
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            flex: 1,
          }}>
          <View>
            <Text style={styles?.name}>{item?.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                // marginTop: 5,
                alignItems: 'center',
              }}>
              {/* Rating Section */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexShrink: 1,
                  flexGrow: 0,
                }}>
                <Entypo name={'star'} size={16} color={'red'} />
                <Text style={styles?.ratings}>
                  {parseFloat(item?.average_rating).toFixed(1)}
                </Text>
                <Text
                  style={[
                    styles?.reviews,
                    {marginLeft: 5, color: 'black', marginTop: '-0.5%'},
                  ]}>
                  {item?.reviews_avg_rating
                    ? `(${parseInt(item?.total_reviews)})`
                    : '(No Rating)'}
                </Text>
              </View>

              {/* Spacer for layout consistency */}
              {item?.vendor_details?.restuarnat_title && (
                <Text
                  style={[
                    styles?.delivery_time,
                    {
                      // marginLeft: 10,
                    },
                  ]}>
                  {item?.vendor_details?.restuarnat_title}
                </Text>
              )}
            </View>
          </View>

          <View style={{flexShrink: 1, flexGrow: 0}}>
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="access-time-filled"
                size={15}
                color="black"
                style={{alignSelf: 'center'}}
              />
              <Text style={styles?.delivery_time}>
                {item?.vendor_details?.min_prepare_time}-
                {item?.vendor_details?.max_prepare_time} min
              </Text>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name="bag"
                  size={15}
                  color="black"
                  style={{alignSelf: 'center'}}
                />
                <Text style={styles?.delivery_time}>
                  {'Min ' + item?.vendor_details?.minimum_price}
                </Text>
                <MaterialIcons
                  name="euro"
                  size={15}
                  color="black"
                  style={{alignSelf: 'center', marginTop: '4%'}}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: '2%',
                  justifyContent: 'flex-start',
                }}>
                <MaterialIcons
                  name="motorcycle"
                  size={21}
                  color="black"
                  style={{alignSelf: 'center'}}
                />
                <Text style={styles?.delivery_time}>
                  {item?.vendor_details?.delivery_cost}
                </Text>
                <MaterialIcons
                  name="euro"
                  size={15}
                  color="black"
                  style={{alignSelf: 'center', marginTop: '4%'}}
                />
                <Text style={styles?.delivery_time}>Delivery</Text>
              </View>
            </View>
          </View>

          {item?.isOffer && (
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons
                name={'local-offer'}
                size={15}
                color={'red'}
                style={{
                  // backgroundColor: YELLOW,
                  padding: 5,
                  borderRadius: 15,
                }}
              />
              <Text
                style={[
                  styles?.delivery_time,
                  {color: 'black', marginLeft: 3},
                ]}>
                {item.offers?.[0]?.title}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    setTimeout(() => {
      setisLoading(false);
    }, 1200);
  });

  const RestaurantListHeader = () => {
    const navigation = useNavigation();
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-SemiBold',
              paddingHorizontal: 15,
              paddingTop: 10,
            }}>
            Find your flavour
          </Text>
          <TouchableOpacity
            onPress={() => setShowSearchBar(true)}
            style={{
              alignSelf: 'center',
              marginHorizontal: 10,
            }}>
            <FontAwesome name="search" size={22} color={'red'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() => navigation.navigate('Filter')}>
            <FontAwesome name="sliders" size={22} color={'red'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Seeall')}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-SemiBold',
                paddingHorizontal: 15,
                paddingTop: 10,
                textDecorationLine: 'underline',
              }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            marginLeft: 10,
          }}>
          <FlatList
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            data={vendorsData?.categories}
            renderItem={renderCategoryList}
            keyExtractor={item => item?.id.toString()}
            horizontal
          />
        </View>
      </View>
    );
  };

  const renderSearchedRestaurants = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{marginHorizontal: 18, marginTop: index > 0 ? 20 : 0}}>
        <Image
          source={{uri: item?.image}}
          style={{height: 140, overflow: 'hidden'}}
        />
        <View style={{}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles?.name}>{item?.name}</Text>
            <View style={{flexDirection: 'row', marginTop: 2}}>
              <Entypo name={'star'} size={16} color={'red'} style={{top: 0}} />
              <Text style={styles?.ratings}>{item?.ratings}</Text>
              <Text style={styles?.reviews}>{item?.reviews}</Text>
            </View>
          </View>

          {/* <View style={{flexDirection: 'row', justifyContent: 'space-around'}}> */}
          <View style={{flexDirection: 'row'}}>
            <MaterialIcons
              name="access-time-filled"
              size={15}
              color="#ccc"
              style={{alignSelf: 'center'}}
            />
            <Text style={styles?.delivery_time}>{item?.delivery_time}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <MaterialIcons
              name="motorcycle"
              size={20}
              color="#ccc"
              style={{alignSelf: 'center'}}
            />
            <Text style={styles?.delivery_time}>{item?.delivery_charge}</Text>
            <MaterialIcons
              name="euro"
              size={12}
              color="#ccc"
              style={{alignSelf: 'center'}}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name="bag"
              size={15}
              color="#ccc"
              style={{alignSelf: 'center'}}
            />
            <Text style={styles?.delivery_time}>
              {'Min ' + item?.min_delivery}
            </Text>
            <MaterialIcons
              name="euro"
              size={12}
              color="#ccc"
              style={{alignSelf: 'center'}}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons
              name="arrow-top-right-bold-box"
              size={50}
              color="#ccc"
              style={{alignSelf: 'center'}}
            />
            <Text style={styles?.delivery_time}>{'Sponsored'}</Text>
          </View>
          {/* </View> */}

          {item?.isOffer && (
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons
                name={'local-offer'}
                size={15}
                color={'red'}
                style={{
                  backgroundColor: 'yellow',
                  padding: 5,
                  borderRadius: 15,
                }}
              />
              <Text style={[styles?.delivery_time, {color: 'black'}]}>
                Offer
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = term => {
    setSearchTerm(term);
    const filteredItems = vendorsData?.vendors.filter(item =>
      item?.name.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredCouponData(filteredItems);
  };
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {isLoading && (
        <View>
          <ShimmerPlaceholder
            style={[
              {
                height: 200,
                borderWidth: 0,
                margin: 20,
                width: width - 40,
                borderRadius: 10,
              },
            ]}
            shimmerColors={[
              'lightgrey',
              '#e8e8e8',
              '#e8e8e8',
            ]}></ShimmerPlaceholder>
          <ShimmerPlaceholder
            style={[
              {
                height: 200,
                borderWidth: 0,
                margin: 20,
                width: width - 40,
                borderRadius: 10,
              },
            ]}
            shimmerColors={[
              'lightgrey',
              '#e8e8e8',
              '#e8e8e8',
            ]}></ShimmerPlaceholder>
          <ShimmerPlaceholder
            style={[
              {
                height: 200,
                borderWidth: 0,
                margin: 20,
                width: width - 40,
                borderRadius: 10,
              },
            ]}
            shimmerColors={[
              'lightgrey',
              '#e8e8e8',
              '#e8e8e8',
            ]}></ShimmerPlaceholder>
          <ShimmerPlaceholder
            style={[
              {
                height: 200,
                borderWidth: 0,
                margin: 20,
                width: width - 40,
                borderRadius: 10,
              },
            ]}
            shimmerColors={[
              'lightgrey',
              '#e8e8e8',
              '#e8e8e8',
            ]}></ShimmerPlaceholder>
        </View>
      )}

      {!isLoading && (
        <SafeAreaView style={{flex: 1, paddingTop: insets.top}}>
          {/* New Search Bar */}
          {showSearchBar && (
            <View style={styles.searchHeader}>
              <TouchableOpacity
                onPress={() => setShowSearchBar(false)}
                style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="red" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Restaurant Name"
                placeholderTextColor="grey"
                value={searchTerm}
                onChangeText={handleSearch}
                autoFocus={true}
              />
            </View>
          )}

          {/* Original Header */}
          {!showSearchBar && (
            <View
              style={[
                {
                  width: width,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                },
                styles.View,
              ]}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => 
                    navigation.navigate('Locationsearch', { 
                      currentAddress: address,
                      onAddressUpdate: (newAddress) => setAddress(newAddress)
                    })
                  }
                  style={{alignSelf: 'center', flexShrink: 1}}>
                  <Text style={styles?.address}>
                    {address?.length > 20 ? address.slice(0, 20) + '...' : address}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Locationsearch')}
                  style={{alignSelf: 'center'}}>
                  <Entypo
                    name="chevron-down"
                    size={22}
                    color={'black'}
                    style={{}}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 15,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 20,
                  flexGrow: 0,
                  flexShrink: 0,
                }}>
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 140,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: 'white',
                    flexDirection: 'row',
                    overflow: 'hidden',
                    //   padding:2
                  }}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    setIsOn(!isOn);
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '70%',
                      backgroundColor: isOn ? '#D3D3D3' : '#D3D3D3',
                      alignSelf: isOn ? 'flex-end' : 'flex-start',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      borderRadius: 15,
                    }}>
                    {isOn ? (
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons
                          name="motorcycle"
                          size={20}
                          style={{marginRight: 2}}
                          color="red"
                        />
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 13.5,
                            fontWeight: '600',
                          }}>
                          Delivery
                        </Text>
                      </View>
                    ) : (
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons
                          name="local-mall"
                          size={18}
                          style={{marginRight: 2}}
                          color="red"
                        />
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 13.5,
                            fontWeight: '600',
                          }}>
                          Pickup
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '30%',
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
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

          <View style={{flex: 1}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 20}}
              data={showSearchBar ? filteredCouponData : vendorsData?.vendors}
              renderItem={renderRestaurants}
              keyExtractor={item => item?.id.toString()}
              ListHeaderComponent={showSearchBar ? null : RestaurantListHeader}
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  View: {
    borderBottomWidth: 1,
    borderBottomColor: 'orange',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    gap: '1%',
  },
  address: {
    color: 'black',
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 12.5,
    shadowColor: '#000', // iOS
    shadowOffset: {width: 0, height: 0.5}, // iOS
    shadowOpacity: 0.3, // iOS
    shadowRadius: 2, // iOS
    textShadowColor: '#000', // Android
    textShadowOffset: {width: 0, height: 0.5}, // Android
    textShadowRadius: 1, // Android
    flexShrink: 1,
  },
  // touch: {
  //   flex: 1,
  // },
  Text: {
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 12,
  },
  name: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    // width: 200,
  },
  ratings: {
    color: 'red',
    fontFamily: 'Poppins-Medium',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  reviews: {
    color: '#555555',
    fontFamily: 'Poppins-Medium',
    fontSize: 12.5,
    marginLeft: 5,
    marginTop: 5,
  },
  delivery_time: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    top: 2.5,
    marginLeft: 5,
  },
  deliveryOptionsContainer: {
    // paddingHorizontal: 10,
    // paddingTop: 10,
  },
  deliveryOptions: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 2,
    borderRadius: 35,
    alignSelf: 'center',
  },
  deliveryButton: {
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {fontWeight: 'bold', color: '#000', fontSize: 12},
  deliveryTime: {fontSize: 12, color: 'black'},
  collectionButton: {
    backgroundColor: '#ddd',
    padding: 4,
    borderRadius: 30,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  ViewSearch: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 10,
    margin: 10,
    marginLeft: 0,
    borderRadius: 10,
    width: '83%',
  },
  inputSearch: {color: 'black', fontFamily: 'Poppins-Medium', flex: 1, top: 2},
  View1: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  TextSearch: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginTop: 15,
    alignSelf: 'center',
  },
  Text1: {
    color: 'grey',
    fontFamily: 'Poppins-Regular',
    width: 250,
    textAlign: 'center',
    fontSize: 12,
  },
  // New styles for search header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'orange',
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 0,
    color: 'black',
  fontSize:16,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
});

export default SearchResto