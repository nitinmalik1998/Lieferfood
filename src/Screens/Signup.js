import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
// import {
//   BLACK,
//   red,
//   WHITE,
//   placeholderColor,
//   LIGHTGREY,
// } from './utils/ColorConstant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Signup = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const storeUserData = async userData => {
    try {
      // Convert everything to a string before storing
      await AsyncStorage.setItem('user_id', userData.id.toString());
      await AsyncStorage.setItem('email', userData.email);
      await AsyncStorage.setItem('name', userData.name);
      await AsyncStorage.setItem('surname', userData.surname);
      await AsyncStorage.setItem('phone', userData.phone.toString());

      console.log('User data saved in AsyncStorage:', userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const onSignup = async () => {
    if (
      name.length === 0 ||
      email.length === 0 ||
      phone.length === 0 ||
      password.length === 0
    ) {
      Snackbar.show({
        text: 'All fields must be filled',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: 'red',
        fontFamily: 'Poppins-Bold',
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);

    try {
      const response = await axios.post(
        'https://argosmob.uk/dhillon/public/api/v1/auth/signup',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Registration Response:', response.data);

      if (response.data.status == true) {
        // Store user data in AsyncStorage
        const userData = {
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          id: response?.data?.data?.id,
        };
        await storeUserData(userData);

        // Navigate after storage is successful
        navigation.navigate('DrawerNavigation');
      } else {
        Snackbar.show({
          text: response.data.message || 'Registration failed',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: 'red',
        });
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Snackbar.show({
        text: 'An error occurred during registration',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: 'red',
      });
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://png.pngtree.com/background/20210711/original/pngtree-delicious-pizza-background-material-picture-image_1104355.jpg',
      }}
      style={{flex: 1}}
      blurRadius={9}>
      <View style={{padding: 15}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 30}}>
          <View>
            <Text style={styles?.login}>Registration</Text>
            <View>
              <Text style={styles?.Text}>
                Please sign up first to continue with{' '}
              </Text>
              <Text
                style={[
                  styles?.Text,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: 'lightgrey',
                    fontSize: 15,
                  },
                ]}>
                My Pizzeria
              </Text>
            </View>

            <Text style={styles?.Text1}>First Name</Text>
            <View style={styles?.View}>
              <TextInput
                placeholder="First name"
                placeholderTextColor={"#d3d3d3"}
                style={styles?.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles?.Text1}>Surname</Text>
            <View style={styles?.View}>
              <TextInput
                placeholder="Surname"
                placeholderTextColor={"#d3d3d3"}
                style={styles?.input}
                value={surname}
                onChangeText={setSurname}
              />
            </View>

            <Text style={styles?.Text1}>Email</Text>
            <View style={styles?.View}>
              <TextInput
                placeholder="abc@example.com"
                placeholderTextColor={"#d3d3d3"}
                style={styles?.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles?.Text1}>Mobile</Text>
            <View style={styles?.View}>
              <TextInput
                placeholder="9999999999"
                placeholderTextColor={"#d3d3d3"}
                style={styles?.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="number-pad"
              />
            </View>

            <Text style={[styles?.Text1, {marginTop: 20}]}>Password</Text>
            <View
              style={[
                styles?.View,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}>
              <TextInput
                placeholder="******"
                placeholderTextColor={"#d3d3d3"}
                style={styles?.input}
                maxLength={10}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  alignSelf: 'center',
                  marginHorizontal: 10,
                }}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={'red'}
                  style={{alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onSignup} style={styles?.touch1}>
              <Text style={styles?.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles?.View1}>
              <Text style={styles?.Text2}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{alignSelf: 'center'}}>
                <Text style={styles?.signup}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
  login: {fontFamily: 'Poppins-SemiBold', fontSize: 34, color: 'white'},
  Text: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  View: {
    backgroundColor: 'white',
    borderRadius: 50,
  },
  Text1: {
    color: 'white',
    marginTop: 20,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    marginHorizontal: 10,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    color: 'black',
    fontSize: 12.5,
  },

  touch1: {
    backgroundColor: 'red',
    elevation: 5,
    marginTop: 60,
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },

  View1: {flexDirection: 'row', justifyContent: 'center', marginTop: 30},
  Text2: {
    color: 'lightgrey',
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  signup: {
    color: 'white',
    backgroundColor: 'rgba(52,52,52,0.6)',
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
