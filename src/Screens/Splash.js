// import React from 'react';
// import {Image, Text, View, StyleSheet, ActivityIndicator} from 'react-native';

// const Splash = () => {
//   return (
//     <View style={styles.container}>
//       <Image
//         source={{
//           uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo5.png',
//         }}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//       {/* <Text style={styles.title}>Welcome to the App</Text>
//       <ActivityIndicator size="large" color="#8337B2" /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff', // You can change to your brand color
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#8337B2',
//     marginBottom: 30,
//   },
// });

// export default Splash;


import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Login screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Replace with your actual screen name
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{
          uri: 'https://argosmob.uk/dhillon/public/uploads/logo/logo5.png',
        }}
        style={[
          styles.logo,
          {
            transform: [{scale: scaleAnim}],
            opacity: opacityAnim,
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, {opacity: opacityAnim}]}>
        Welcome to the Lieferfood
      </Animated.Text>
      {/* <ActivityIndicator size="large" color="#8337B2" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 30,
  },
});

export default Splash;