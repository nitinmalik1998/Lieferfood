import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const Addresses = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postcode: '',
    latitude: null,
    longitude: null,
    address: ''
  });
  
  const { getColors } = useTheme();
  const colors = getColors();

  useEffect(() => {
    loadAddresses();
    
    // Check if we have location data from the Location screen
    if (route.params?.locationData) {
      const { street, city, postcode, latitude, longitude, address } = route.params.locationData;
      setFormData({
        street: street || '',
        city: city || '',
        postcode: postcode || '',
        latitude,
        longitude,
        address: address || ''
      });
      setEditMode(false);
      setCurrentAddress(null);
      setModalVisible(true);
    }
  }, [route.params]);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        // Set initial addresses
        const initialAddresses = [
          { id: 1, street: 'Alexanderplatz 1', city: 'Berlin', postcode: '10178' },
         { id: 2, street: 'Römerberg 23', city: 'Frankfurt', postcode: '60311' },
        ];
        setAddresses(initialAddresses);
        await saveAddresses(initialAddresses);
      }
    } catch (e) {
      console.log('Error loading addresses', e);
    }
  };

  const saveAddresses = async (updatedAddresses) => {
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    } catch (e) {
      console.log('Error saving addresses', e);
    }
  };

  const handleAddPress = () => {
    setFormData({ 
      street: '', 
      city: '', 
      postcode: '',
      latitude: null,
      longitude: null,
      address: ''
    });
    setCurrentAddress(null);
    setEditMode(false);
    setModalVisible(true);
  };

  const handleEditPress = (item) => {
    setFormData({
      street: item.street,
      city: item.city,
      postcode: item.postcode,
      latitude: item.latitude,
      longitude: item.longitude,
      address: item.address
    });
    setCurrentAddress(item);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDeletePress = async (item) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== item.id);
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const handleSave = async () => {
    const { street, city, postcode, latitude, longitude, address } = formData;
    
    if (!street.trim() || !city.trim() || !postcode.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    let updatedAddresses = [];

    if (editMode && currentAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === currentAddress.id 
          ? { ...formData, id: currentAddress.id } 
          : addr
      );
    } else {
      // Add new address (max 20)
      if (addresses.length >= 20) {
        Alert.alert('Limit Reached', 'You can only save up to 20 addresses');
        return;
      }
      
      const newAddress = {
        id: Date.now(),
        ...formData
      };
      updatedAddresses = [...addresses, newAddress];
    }
    
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const fullAddress = item.address || `${item.street}, ${item.postcode} ${item.city}`;
    
    return (
      <TouchableOpacity style={[styles(colors).addresstouchable]}>
        <View style={styles(colors).addressContainer}>
          <View style={styles(colors).addressContent}>
            <Icon1 name="location-outline" size={24} color="green" />
            <Text numberOfLines={2} style={styles(colors).addresstext}>
              {fullAddress}
            </Text>
          </View>
          <View style={styles(colors).addressActions}>
            <TouchableOpacity 
              onPress={() => handleEditPress(item)}
              style={styles(colors).actionButton}
            >
              <Icon name="edit" size={24} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeletePress(item)}
              style={styles(colors).actionButton}
            >
             <MaterialIcons name="delete" size={25} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = (colors) => StyleSheet.create({
    personalview: {
      flexDirection: 'row',
      backgroundColor: 'red',
      paddingVertical: 7,
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      alignItems: 'center'
    },
    arrowtouchable: {},
    personaltext: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: moderateScale(20),
    },
    addresstouchable: {
      paddingVertical: 15,
      marginHorizontal: 15,
      borderRadius: 10,
      marginTop: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      backgroundColor: colors.card,
    },
    addressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    addressContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    addressActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 5,
    },
    addresstext: {
      marginLeft: 12,
      fontSize: moderateScale(14),
      flex: 1,
      fontWeight: "500",
      color: colors.text,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 20,
    },
    modalTitle: {
      fontSize: moderateScale(20),
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
      fontSize: moderateScale(16),
      color: colors.text,
      backgroundColor: colors.card1,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      paddingVertical: 12,
      borderRadius: 30,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 10,
    },
    cancelButton: {
      backgroundColor: colors.card1,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      backgroundColor: 'red',
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: moderateScale(16),
    },
    cancelButtonText: {
      color: colors.text,
    },
    saveButtonText: {
      color: 'white',
    },
    addButtonContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      padding: 15,
    },
    addButton: {
      backgroundColor: 'red',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
    },
    addButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: moderateScale(16),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: height * 0.2,
    },
    emptyText: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      marginTop: 20,
      color: colors.text,
    },
    emptySubtext: {
      fontSize: moderateScale(14),
      color: colors.placeholder,
      marginTop: 8,
    },
  });

  return (
    <View
      style={{ 
        paddingTop: insets.top, 
        flex: 1, 
        paddingBottom: insets.bottom,
        backgroundColor: colors.background 
      }}>
      {/* Header */}
      <View style={styles(colors).personalview}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={styles(colors).arrowtouchable}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles(colors).personaltext}>Addresses</Text>
        <TouchableOpacity onPress={handleAddPress}>
          <Icon name="plus" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles(colors).emptyContainer}>
            <Icon1 name="location-outline" size={60} color={colors.placeholder} />
            <Text style={styles(colors).emptyText}>No addresses saved yet</Text>
            <Text style={styles(colors).emptySubtext}>Add your first address to get started</Text>
          </View>
        }
      />

      {/* Add Address Button */}
      <View style={[styles(colors).addButtonContainer, { bottom: insets.bottom+40 }]}>
        <TouchableOpacity 
          style={styles(colors).addButton} 
          onPress={handleAddPress}
        >
          <Text style={styles(colors).addButtonText}>Add Address</Text>
        </TouchableOpacity>
      </View>

      {/* Add/Edit Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles(colors).modalContainer}>
          <ScrollView contentContainerStyle={styles(colors).scrollContainer}>
            <View style={styles(colors).modalContent}>
              <Text style={styles(colors).modalTitle}>
                {editMode ? 'Edit Address' : 'Add New Address'}
              </Text>

              <TextInput
                style={styles(colors).input}
                placeholder="Street and house number"
                value={formData.street}
                onChangeText={text => setFormData({ ...formData, street: text })}
                placeholderTextColor={colors.placeholder}
              />

              <TextInput
                style={styles(colors).input}
                placeholder="City"
                value={formData.city}
                onChangeText={text => setFormData({ ...formData, city: text })}
                placeholderTextColor={colors.placeholder}
              />

              <TextInput
                style={styles(colors).input}
                placeholder="Postcode"
                value={formData.postcode}
                onChangeText={text => setFormData({ ...formData, postcode: text })}
                keyboardType="numeric"
                placeholderTextColor={colors.placeholder}
                maxLength={5}
              />

              <View style={styles(colors).buttonContainer}>
                <TouchableOpacity
                  style={[styles(colors).button, styles(colors).cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={[styles(colors).buttonText, styles(colors).cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles(colors).button, styles(colors).saveButton]}
                  onPress={handleSave}>
                  <Text style={[styles(colors).buttonText, styles(colors).saveButtonText]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Addresses;