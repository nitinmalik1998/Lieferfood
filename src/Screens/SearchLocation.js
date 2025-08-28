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

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);


// Initialize with your actual API key
Geocoder.init('AIzaSyAonK15hotzDslX4ePjIbmizRii-7Ng4QE', {language: 'en'});

const SearchLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

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
        // iOS automatically shows permission prompt
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

  return (
    <View style={styles.container}>
      {/* Search Container - Preserved your original styling */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchInputRef}
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            fetchSuggestions(text);
          }}
          style={styles.searchInput}
          placeholder="Search for a place or address"
          placeholderTextColor="#999"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              setSuggestions([]);
            }}>
            <Icon name="close" size={24} color="#999" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <Icon name="search" size={28} color="red" />
          )}
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(item)}>
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {item.formatted_address}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}

      {/* Map View with your original styling */}
      <MapView
        ref={mapRef}
        style={styles.map}
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
          setShowSuggestions(false);
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

      {/* Current Location Button - Your original styling */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={getCurrentLocation}
        disabled={isLoading}>
        <Icon name="my-location" size={25} color="red" />
      </TouchableOpacity>
    </View>
  );
};

// All your original styles plus new styles for suggestions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 40,
  },
  searchInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: moderateScale(16),
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  clearButton: {
    padding: 5,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
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
  },
  // New styles for suggestions
  suggestionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 2,
    marginTop: 40,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
});

export default SearchLocation;
