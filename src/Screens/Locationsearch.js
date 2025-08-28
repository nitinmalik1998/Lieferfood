// LocationScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../State/ThemeContext';  // Adjust path as needed

// Initialize Geocoder with your API key
Geocoder.init('AIzaSyAonK15hotzDslX4ePjIbmizRii-7Ng4QE', { language: 'en' });

const LocationScreen = ({ navigation, route }) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  
  const insets = useSafeAreaInsets();
  const { getColors } = useTheme();
  const colors = getColors();

  // Initialize with passed address if available
  useEffect(() => {
    if (route.params?.currentAddress) {
      setAddress(route.params.currentAddress);
    }
  }, [route.params?.currentAddress]);

  // Load saved addresses when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedAddresses = async () => {
        try {
          const saved = await AsyncStorage.getItem('userAddresses');
          if (saved) {
            setSavedAddresses(JSON.parse(saved));
          }
        } catch (e) {
          console.log('Error loading saved addresses', e);
        }
      };
      
      loadSavedAddresses();
    }, [])
  );

  // Function to get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      error => {
        console.log('Error getting location:', error);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Convert coordinates to address
  const reverseGeocode = (lat, lng) => {
    Geocoder.from(lat, lng)
      .then(json => {
        const result = json.results[0];
        if (result) {
          const formattedAddress = result.formatted_address || '';
          setAddress(formattedAddress);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log('Geocoding error:', error);
        setIsLoading(false);
      });
  };

  // Function to search for locations
  const searchLocations = async (query) => {
    setAddress(query);
    
    if (query.length === 0) {
      setShowResults(false);
      return;
    }
    
    if (query.length > 2) {
      try {
        const response = await Geocoder.from(query);
        const results = response.results.map(result => ({
          id: result.place_id,
          address: result.formatted_address,
          location: result.geometry.location,
        }));
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.log('Search error:', error);
      }
    } else {
      setShowResults(false);
    }
  };

  // Function to save address and go back
  const saveAddress = async () => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('userAddress', address);
      
      // Call callback if exists
      if (route.params?.onAddressUpdate) {
        route.params.onAddressUpdate(address);
      }
      
      // Navigate back with updated address
      navigation.navigate('TabNavigation', { updatedAddress: address });
    } catch (e) {
      console.log('Error saving address:', e);
    }
  };

  // Handle location selection from search
  const handleLocationSelect = (location) => {
    setAddress(location.address);
    setShowResults(false);
    Keyboard.dismiss();
  };

  // Delete saved address
  const deleteAddress = async (index) => {
    try {
      const newAddresses = [...savedAddresses];
      newAddresses.splice(index, 1);
      
      await AsyncStorage.setItem('userAddresses', JSON.stringify(newAddresses));
      setSavedAddresses(newAddresses);
    } catch (e) {
      console.log('Error deleting address', e);
    }
  };

  // Create styles with current theme colors
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
     backgroundColor: colors.background,
     paddingVertical: 10,
     
    },
    title: {
      fontSize: 17,
      fontWeight: '500',
      marginLeft: 20,
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.tabicon === 'grey' ? '#64B5F6' : colors.toggleActive, // Blue in light, theme color in dark
      borderRadius: 10,
      margin: 16,
      paddingHorizontal: 12,
      marginTop: 20,
      backgroundColor: colors.card,
    },
    input: {
      flex: 1,
      height: 50,
      color: colors.text,
      fontSize: 16,
    },
    clearButton: {
      padding: 8,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    locationText: {
      marginLeft: 10,
      fontSize: 16,
      color: colors.tabicon === 'grey' ? '#64B5F6' : colors.icon, // Blue in light, icon color in dark
    },
    loader: {
      marginLeft: 10,
    },
    manualButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    manualText: {
      marginLeft: 10,
      fontSize: 16,
      color: colors.tabicon === 'grey' ? '#64B5F6' : colors.icon, // Blue in light, icon color in dark
    },
    resultsContainer: {
      maxHeight: 300,
      marginTop: 10,
      marginHorizontal: 15,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultText: {
      marginLeft: 10,
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    sectionHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: colors.card1,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    plusButton: {
      padding: 5,
      backgroundColor: colors.card1,
      borderRadius: 50
    },
    savedAddressesContainer: {
      marginTop: 20,
      marginHorizontal: 15,
    },
    savedAddressesList: {
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    },
    savedAddressItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    addressTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    addressIcon: {
      marginRight: 10,
    },
    savedAddressText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    deleteButton: {
      padding: 5,
      marginLeft: 10,
    },
    saveButton: {
      backgroundColor: 'red',
      borderRadius: 30,
      padding: 12,
      margin: 16,
      alignItems: 'center',
      marginTop: "10%",
      marginBottom: "20%"
    },
    disabledButton: {
      backgroundColor: colors.toggleInactive,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
  }), [colors]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="red" />
          </TouchableOpacity>
          <Text style={styles.title}>Enter Your Location</Text>
        </View>

        <View style={styles.divider} />

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Address"
            placeholderTextColor={colors.placeholder}
            value={address}
            onChangeText={searchLocations}
            autoFocus={true}
          />
          {address.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setAddress('');
                setShowResults(false);
              }}
              style={styles.clearButton}
            >
              <MaterialIcons name="clear" size={22} color={colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        {/* Location Icon */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={isLoading}
        >
          <MaterialIcons name="my-location" size={22} color={colors.tabicon === 'grey' ? '#64B5F6' : colors.icon} />
          <Text style={styles.locationText}>Use your location</Text>
          {isLoading && <ActivityIndicator size="small" color={colors.tabicon === 'grey' ? '#64B5F6' : colors.icon} style={styles.loader} />}
        </TouchableOpacity>

        {/* Manual Address Button */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => navigation.navigate('Address')}
        >
          <MaterialCommunityIcons name="pencil" size={22} color={colors.tabicon === 'grey' ? '#64B5F6' : colors.icon} />
          <Text style={styles.manualText}>Enter Address Manually</Text>
        </TouchableOpacity>

        {/* Search Results */}
        {showResults && (
          <ScrollView style={styles.resultsContainer}>
            {searchResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => handleLocationSelect(item)}
              >
                <MaterialIcons name="location-on" size={20} color="red" />
                <Text style={styles.resultText}>{item.address}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Your Addresses Section */}
        {!showResults && savedAddresses.length > 0 && (
          <View style={styles.savedAddressesContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Your Addresses</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Address')}
                style={styles.plusButton}
              >
                <MaterialCommunityIcons name="plus" size={25} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.savedAddressesList}>
              {savedAddresses.map((item, index) => (
                <View key={index} style={styles.savedAddressItem}>
                  <TouchableOpacity 
                    style={styles.addressTextContainer}
                    onPress={() => {
                      const formattedAddress = `${item.street}, ${item.postcode} ${item.city}`;
                      setAddress(formattedAddress);
                      Keyboard.dismiss();
                    }}
                  >
                    <MaterialIcons name="location-on" size={20} color="red" style={styles.addressIcon} />
                    <Text style={styles.savedAddressText} numberOfLines={1}>
                      {item.street}, {item.postcode} {item.city}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteAddress(index)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={22} color={colors.placeholder} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, !address && styles.disabledButton]}
          onPress={saveAddress}
          disabled={!address}
        >
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationScreen;