import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../State/ThemeContext'; // Import useTheme
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

const Help = () => {
  const navigation = useNavigation();
  const { getColors } = useTheme();
  const colors = getColors();
  const insets = useSafeAreaInsets();

  // Create styles with theme colors
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
     paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.headerBg,
      paddingVertical: 6,
      paddingHorizontal: 15,
      alignItems: 'center',
    },
    helptext: {
      textAlign: 'center',
      color: 'white',
      fontSize: moderateScale(20),
      flex: 1,
      fontWeight: 'bold',
      marginRight: 28,
    },
    ScrollView: {
      marginHorizontal: 15
    },
    titletext: {
      paddingVertical: 15,
      fontSize: moderateScale(25),
      fontWeight: "bold",
      color: colors.text
    },
    subtitletext: {
      fontSize: 19,
      marginTop: 15,
      fontWeight: "500",
      color: colors.text
    },
    detailtext: {
      paddingTop: 20,
      fontSize: moderateScale(16),
      fontWeight: "400",
      color: colors.text,
      lineHeight: 22
    },
    lieferfoodtext: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      marginTop: 20,
      color: colors.text
    },
    lasttext: {
      fontSize: moderateScale(16),
      color: colors.text
    },
    contacttext: {
      fontSize: moderateScale(20),
      textAlign: "center",
      paddingVertical: 7,
      color: "white",
      fontWeight: "bold"
    },
    contacttouchable: {
      backgroundColor: colors.headerBg,
      marginVertical: 30,
      borderRadius: 30
    }
  }), [colors, moderateScale]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.helptext}>Help</Text>
      </View>
      
      <ScrollView 
        style={styles.ScrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
      >
        <Text style={styles.titletext}>How do I leave a review?</Text>
        <Text style={styles.subtitletext}>Restaurants and stores</Text>
        <Text style={styles.detailtext}>
          The only way to leave a review is to first place an order via Lieferando.de. After you've ordered from a place, you can rate and/or review their products and delivery service on our platform. The easiest way to do that is to check your email after you've received your order. We'll send you a message with a link to review that order. Alternatively, if you have a Lieferando.de account, you can rate and/or review a place you have ordered from in the "Orders" section of your account on our website. Where given the option, you may choose to place the review/rating anonymously if desired. You cannot submit a rating or a review for a business on our platform unless you have ordered from that business via Lieferando.de. You are only able to submit a rating or a review within the two week period following your order. This process gives us confidence that all reviews and ratings are from customers who have ordered via Lieferando.de.
        </Text>
        <Text style={styles.detailtext}>
          Leaving a review helps other people find great places to order from. It's also a chance for you to tell the place you ordered from what they did well and how they could improve. Once submitted, you won't be able to amend your review. Lieferando.de therefore asks for all restaurant or store reviews to be based on genuine experience, informative, helpful and respectful. If you do want to remove a review once it has been published, you may be able to do so by contacting customer services. Your request should come from the email address which is linked to your account/that you used to make your order. Every review and rating will be published. However, once published, we will remove a review and/or rating if it doesn't follow our code of conduct. Take a look at our "Does Lieferando.de moderate reviews?" FAQ for info.
        </Text>
        <Text style={styles.lieferfoodtext}>Lieferfood.de</Text>
        <Text style={styles.lasttext}>
          If you want to review Lieferando.de itself, we'd like to refer you to Trustpilot.
        </Text>
        
        <TouchableOpacity style={styles.contacttouchable}>
          <Text style={styles.contacttext}>Contact us</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Help;