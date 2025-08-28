// Login.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePath from '../constant/ImagePath';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { useTheme } from '../State/ThemeContext'; // Adjust path as needed

const Login = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const { getColors } = useTheme();
  const colors = getColors();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('piyush123@gmail.com');
  const [password, setPassword] = useState('87654321');

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: width * 0.05,
    },
    image: {
      width: '120%',
      height: height * 0.3,
      resizeMode: 'cover',
      alignSelf: 'center',
    },
    contentContainer: {
      paddingVertical: height * 0.02,
    },
    label: {
      fontSize: width * 0.045,
      fontWeight: '600',
      color: colors.text,
      marginVertical: height * 0.01,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: width * 0.04,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: width * 0.04,
      paddingVertical: height * 0.015,
    },
    eyeIcon: {
      padding: width * 0.02,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: height * 0.01,
    },
    forgotPasswordText: {
      color: colors.headerBg,
      fontSize: width * 0.04,
    },
    loginButton: {
      backgroundColor: colors.headerBg,
      paddingVertical: height * 0.01,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: height * 0.03,
    },
    loginButtonText: {
      color: colors.white,
      fontSize: width * 0.06,
      fontWeight: 'bold',
    },
    orText: {
      textAlign: 'center',
      color: colors.text,
      fontSize: width * 0.04,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: width * 0.05,
      
    },
    socialButton: {
      padding: width * 0.02,
      borderRadius: 50,
      backgroundColor: colors.card,
    },
    socialIcon: {
      width: width * 0.09,
      height: width * 0.09,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    footerText: {
      color: colors.placeholder,
      fontSize: width * 0.04,
    },
    signupText: {
      color: colors.headerBg,
      fontSize: width * 0.045,
      fontWeight: 'bold',
    },
  }), [colors, width, height]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '139263092189-bcm7g7osb7v9blh7ied22p38d5f2m8tl.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken || signInResult.idToken;
    
    if (!idToken) {
      throw new Error('No ID token found');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    return auth().signInWithCredential(facebookCredential);
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Image 
        style={styles.image} 
        source={require('../Images/Banner.webp')} 
      />
      
      <View style={styles.contentContainer}>
        <Image 
          style={{ height: 50, resizeMode: 'contain' }}
          source={{
            uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo5.png',
          }}
        />

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="******"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            maxLength={10}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={width * 0.06}
              color={colors.headerBg}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!email || !password}
          onPress={() => navigation.navigate('TabNavigation')}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or login with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onGoogleButtonPress}
          >
            <Image source={ImagePath?.google} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={onFacebookButtonPress}
          >
            <Image source={ImagePath?.fb1} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;