import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Text,
  FlatList,
  Dimensions
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geocoder from 'react-native-geocoding';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

Geocoder.init('AIzaSyAonK15hotzDslX4ePjIbmizRii-7Ng4QE', {language: 'en'});

const DARK_MAP_STYLE = [
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

const Location = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const { theme, getColors } = useTheme();
  const colors = getColors();

  useEffect(() => {
    const requestLocationPermission = async () => {
      let granted = false;

      if (Platform.OS === 'android') {
        try {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          granted = granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
        }
      } else {
        granted = true;
      }

      setHasLocationPermission(granted);
      if (granted) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission required',
          'Please enable location permissions in settings',
          [{text: 'OK'}],
        );
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        updateMapLocation(latitude, longitude, 'Your Location');
        setIsLoading(false);
      },
      error => {
        console.log('Location error:', error);
        Alert.alert(
          'Location Error',
          'Could not get your location. Please ensure location services are enabled.',
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 10,
      },
    );
  };

  const updateMapLocation = (lat, lng, title = '') => {
    const location = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setCurrentLocation({
      ...location,
      title: title || searchQuery || 'Selected Location',
    });

    if (mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss();
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await Geocoder.from(searchQuery);
      if (response.results.length > 0) {
        const {lat, lng} = response.results[0].geometry.location;
        updateMapLocation(lat, lng, searchQuery);
      } else {
        Alert.alert('Not found', 'Location not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search location');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async query => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await Geocoder.from(query);
      if (response.results) {
        setSuggestions(response.results.slice(0, 5));
      }
    } catch (error) {
      console.error('Suggestion error:', error);
    }
  };

  const handleSuggestionSelect = item => {
    const {lat, lng} = item.geometry.location;
    updateMapLocation(lat, lng, item.formatted_address);
    setSearchQuery(item.formatted_address);
    setShowSuggestions(false);
    searchInputRef.current.blur();
  };

  const handleAddAddress = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Please select a location first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Reverse geocode to get address details
      const response = await Geocoder.from(
        currentLocation.latitude, 
        currentLocation.longitude
      );
      
      if (response.results.length > 0) {
        const address = response.results[0];
        
        // Extract address components
        let street = '';
        let city = '';
        let postcode = '';
        
        for (let component of address.address_components) {
          if (component.types.includes('route')) {
            street = component.long_name;
          }
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postcode = component.long_name;
          }
        }
        
        // If we couldn't get street, use the formatted address
        if (!street) {
          street = address.formatted_address;
        }
        
        // Navigate to Address screen with location data
        navigation.navigate('Address', {
          locationData: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            street,
            city,
            postcode,
            address: address.formatted_address
          }
        });
      } else {
        Alert.alert('Error', 'Could not get address details');
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
      Alert.alert('Error', 'Failed to get address details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles(theme).container}>
      <View style={[styles(theme).searchContainer, {top: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon1 name="arrowleft" size={28} color="red" />
        </TouchableOpacity>
        <TextInput
          ref={searchInputRef}
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            fetchSuggestions(text);
          }}
          style={styles(theme).searchInput}
          placeholder="Search for a place or address"
          placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles(theme).clearButton}
            onPress={() => {
              setSearchQuery('');
              setSuggestions([]);
            }}>
            <Icon name="close" size={24} color={theme === 'DARK' ? '#AAAAAA' : '#666666'} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles(theme).searchButton}
          onPress={handleSearch}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <Icon name="search" size={28} color="red" />
          )}
        </TouchableOpacity>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles(theme).suggestionsContainer, {top: insets.top + 80}]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles(theme).suggestionItem}
                onPress={() => handleSuggestionSelect(item)}>
                <Text style={styles(theme).suggestionText} numberOfLines={2}>
                  {item.formatted_address}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles(theme).map}
        customMapStyle={theme === 'DARK' ? DARK_MAP_STYLE : []}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          currentLocation || {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        onPress={e => {
          const {latitude, longitude} = e.nativeEvent.coordinate;
          updateMapLocation(latitude, longitude);
          setShowSuggestions(true);
        }}>
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title={currentLocation.title}
            description={searchQuery ? 'Searched location' : 'Current location'}
          />
        )}
      </MapView>

      <View style={[styles(theme).bottomContainer, {bottom: insets.bottom + 20}]}>
        <TouchableOpacity 
          style={styles(theme).addAddressButton}
          onPress={handleAddAddress}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles(theme).addAddressText}>Add Address</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles(theme).locationButton}
          onPress={getCurrentLocation}
          disabled={isLoading}>
          <Icon name="my-location" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'DARK' ? '#121212' : '#FFFFFF',
    
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: theme === 'DARK' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: moderateScale(16),
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  clearButton: {
    padding: 5,
  },
  bottomContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addAddressButton: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: theme === 'DARK' ? '#1E1E1E' : '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
  },
  addAddressText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: theme === 'DARK' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    zIndex: 2,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'DARK' ? '#333333' : '#EEEEEE',
  },
  suggestionText: {
    fontSize: moderateScale(16),
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
  },
});

export default Location;