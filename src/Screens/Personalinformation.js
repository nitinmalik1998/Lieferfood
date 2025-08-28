import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../State/ThemeContext'; // Adjust import path as needed

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

// Profile Image component with error handling
const ProfileImage = ({uri, style, theme}) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <View style={[style, styles(theme).fallbackContainer]}>
        <Icon name="user" size={moderateScale(40)} color={theme === 'DARK' ? '#AAAAAA' : '#666666'} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      onError={() => setError(true)}
    />
  );
};

const Personalinformation = () => {
  const insets = useSafeAreaInsets();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  
  const navigation = useNavigation();
  const { theme, getColors } = useTheme();
  const colors = getColors();
  
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      style={styles(theme).scrollContainer}
    >
      <View style={[styles(theme).container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <View style={styles(theme).personalview}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles(theme).arrowtouchable}>
            <Icon name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles(theme).personaltext}>Personal Information</Text>
        </View>
        
        <ProfileImage 
          uri={'https://th.bing.com/th/id/R.46c9bf15f97b3d9ac756ffcded16140d?rik=PY0r%2fu4ePFDw3w&riu=http%3a%2f%2fstatics.sportskeeda.com%2fwp-content%2fuploads%2f2013%2f03%2f110406770-1362486107.jpg&ehk=yD9%2bdr4Il5vFkMq%2fvbUGX7NFHU9FmBZWSonj%2bPQCcvA%3d&risl=&pid=ImgRaw&r=0'} 
          style={styles(theme).imagestyle}
          theme={theme}
        />
        
        <View style={styles(theme).detailview}>
          <View style={styles(theme).formGroup}>
            <Text style={styles(theme).label}>First Name</Text>
            <TextInput
              style={styles(theme).input}
              placeholder="Piyush Kumar"
              value={firstname}
              onChangeText={setFirstName}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
          </View>
          <View style={styles(theme).formGroup}>
            <Text style={styles(theme).label}>Last Name</Text>
            <TextInput
              style={styles(theme).input}
              placeholder="Gaur"
              value={lastname}
              onChangeText={setLastName}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
          </View>
          <View style={styles(theme).formGroup}>
            <Text style={styles(theme).label}>Email Address</Text>
            <TextInput
              style={styles(theme).input}
              placeholder="Piyush123@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
          </View>
          <View style={styles(theme).formGroup}>
            <Text style={styles(theme).label}>Phone</Text>
            <TextInput
              style={styles(theme).input}
              placeholder="9999999999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
          </View>
          <View style={styles(theme).formGroup}>
            <Text style={styles(theme).label}>Address</Text>
            <TextInput
              style={styles(theme).input}
              placeholder="Street and house number"
              value={street}
              onChangeText={setStreet}
              autoCapitalize="words"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
            <TextInput
              style={[styles(theme).input, {marginTop: 10}]}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
            <TextInput
              style={[styles(theme).input, {marginTop: 10}]}
              placeholder="Postcode"
              value={postcode}
              onChangeText={setPostcode}
              keyboardType="numeric"
              placeholderTextColor={theme === 'DARK' ? '#AAAAAA' : '#666666'}
            />
          </View>
        </View>
        <TouchableOpacity style={styles(theme).updatetouchable}>
          <Text style={styles(theme).updatetext}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = (theme) => StyleSheet.create({
  scrollContainer: {
    backgroundColor: theme === 'DARK' ? '#121212' : '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: theme === 'DARK' ? '#121212' : '#FFFFFF',
  },
  personalview: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: "1.5%",
  },
  arrowtouchable: {
    left: 10,
    
  },
  personaltext: {
    marginLeft: "10%",
    color: 'white',
    fontFamily: 'poppin-Medium',
    fontWeight: 'bold',
    fontSize: moderateScale(20),
    alignSelf: 'center',
  },
  imagestyle: {
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(50),
    alignSelf: 'center',
    marginTop: 30,
    borderWidth: 2,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'DARK' ? '#333333' : '#f8f8f8',
    borderWidth: 2,
    borderColor: theme === 'DARK' ? '#333333' : '#E0E0E0',
  },
  label: {
    fontSize: moderateScale(17),
    marginBottom: 8,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: theme === 'DARK' ? '#444444' : '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    color: theme === 'DARK' ? '#FFFFFF' : '#000000',
    backgroundColor: theme === 'DARK' ? '#1E1E1E' : '#FFFFFF',
  },
  formGroup: {
    paddingTop: 15,
  },
  detailview: {
    marginHorizontal: 15, 
    marginTop: 10
  },
  updatetouchable: {
    backgroundColor: 'red',
    paddingVertical: 11,
    borderRadius: 25,
    marginHorizontal: 25,
    marginTop: 60,
    marginBottom: 20,
  },
  updatetext: {
    textAlign: 'center',
    color: 'white',
    fontSize: moderateScale(20),
    fontFamily: 'poppins-Medium',
    fontWeight: 'bold',
  },
});

export default Personalinformation;