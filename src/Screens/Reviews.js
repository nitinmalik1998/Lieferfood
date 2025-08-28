// Reviews.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Rating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import { useTheme } from '../State/ThemeContext'; // Import useTheme
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

const Reviews = () => {
  const [showModal, setShowModal] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const navigation = useNavigation();
   const insets = useSafeAreaInsets();
  
  // Get theme colors
  const { getColors } = useTheme();
  const colors = getColors();

  const toggleReviewExpansion = id => {
    setExpandedReviews(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

    const data = [
    {
      id: 1,
      rating: '5',
      name: 'Tobi',
      date: '12 April 2025',
      review:
        "The broth was aromatic with a bold lemongrass kick, but the noodles were overcooked. Service was quick, and the cozy interior made up for the cramped seating. At $18, it's pricey but unique.",
    },
    {
      id: 2,
      rating: '4',
      name: 'Markus',
      date: '11 April 2025',
      review:
        'The garlic butter shrimp at Ocean Bites was perfectly tender, but the wait time was 45 minutes despite reservations.',
    },
    {
      id: 3,
      rating: '3.5',
      name: 'Kelvin',
      date: '10 April 2025',
      review:
        "Brand X's frozen pizza had a crispy crust but lacked flavor in the sauce",
    },
    {
      id: 4,
      rating: '4.3',
      name: 'Grog',
      date: '9 April 2025',
      review:
        'Green Haven Café offers inventive gluten-free desserts, but cross-contamination is a risk.',
    },
    {
      id: 5,
      rating: '3.9',
      name: 'Herr',
      date: '9 April 2025',
      review:
        "The broth was aromatic with a bold lemongrass kick, but the noodles were overcooked. Service was quick, and the cozy interior made up for the cramped seating. At $18, it's pricey but unique.",
    },
    {
      id: 6,
      rating: '3.8',
      name: 'Patrick',
      date: '8 April 2025',
      review:
        "An elegant dish where the duck's crispy skin contrasted beautifully with the tender meat. The truffle risotto was luxuriously creamy but slightly overpowered the duck. Service was impeccable, and the sommelier paired a stellar Pinot Noir. At $58, it's a splurge, but worth it for a special occasion.",
    },
    {
      id: 7,
      rating: '4',
      name: 'Michael',
      date: '7 April 2025',
      review:
        "Finally, a nut-free cookie that doesn't compromise on taste! Soft, chewy, and loaded with chocolate chunks. My son with allergies loved them. A bit pricey at $4 each, but peace of mind is priceless.",
    },
    {
      id: 8,
      rating: '4.5',
      name: 'Sanja',
      date: '6 April 2025',
      review:
        "Crunchy, spicy, and addictive! The gochujang glaze had the right balance of sweet and heat. The kimchi slaw was a refreshing side. At $10 for a hefty portion, it's a crowd-pleaser. Lines are long, but it moves fast.",
    },
    {
      id: 9,
      rating: '4',
      name: 'David',
      date: '6 April 2025',
      review:
        'A creative fusion! The matcha added earthy depth to the classic tiramisu, and the mascarpone was silky. However, the ladyfingers were too soggy. Still, a fun dessert to try at $8. Festival vibes were lively, but crowds made seating a challenge.',
    },
    {
      id: 10,
      rating: '5',
      name: 'Kelvin',
      date: '10 April 2025',
      review:
        "Brand X's frozen pizza had a crispy crust but lacked flavor in the sauce",
    },
    {
      id: 11,
      rating: '3.5',
      name: 'Kelvin',
      date: '10 April 2025',
      review:
        "Brand X's frozen pizza had a crispy crust but lacked flavor in the sauce",
    },
    {
      id: 12,
      rating: '4.3',
      name: 'Grog',
      date: '9 April 2025',
      review:
        'Green Haven Café offers inventive gluten-free desserts, but cross-contamination is a risk.',
    },
    {
      id: 13,
      rating: '3.9',
      name: 'Herr',
      date: '9 April 2025',
      review:
        "The broth was aromatic with a bold lemongrass kick, but the noodles were overcooked. Service was quick, and the cozy interior made up for the cramped seating. At $18, it's pricey but unique.",
    },
    {
      id: 14,
      rating: '3.8',
      name: 'Patrick',
      date: '8 April 2025',
      review:
        "An elegant dish where the duck's crispy skin contrasted beautifully with the tender meat. The truffle risotto was luxuriously creamy but slightly overpowered the duck. Service was impeccable, and the sommelier paired a stellar Pinot Noir. At $58, it's a splurge, but worth it for a special occasion.",
    },
    {
      id: 15,
      rating: '4',
      name: 'Michael',
      date: '7 April 2025',
      review:
        "Finally, a nut-free cookie that doesn't compromise on taste! Soft, chewy, and loaded with chocolate chunks. My son with allergies loved them. A bit pricey at $4 each, but peace of mind is priceless.",
    },
  ];

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
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.headerBg,
      paddingVertical: 11,
      paddingHorizontal: 20,
    },
    headerTitle: {
      color: 'white',
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    reviewContainer: {
      padding: 20,
      backgroundColor: colors.card,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    name: {
      fontSize: moderateScale(18),
      fontWeight: '600',
      color: colors.text,
    },
    date: {
      fontSize: moderateScale(14),
      color: colors.placeholder,
    },
    rating: {
      alignSelf: 'flex-start',
      marginVertical: 4,
    },
    reviewText: {
      fontSize: moderateScale(15),
      color: colors.text,
      lineHeight: 20,
      marginTop: 8,
    },
    separator: {
      height: 1,
      backgroundColor: colors.divider,
      marginHorizontal: 20,
    },
    listContent: {
      paddingBottom: 20,
    },
    starrate: {},
    mainrating: {
      fontWeight: 'bold',
      fontSize: moderateScale(18),
      color: colors.text,
    },
    starratingview: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30,
      gap: 10,
    },
    secondview: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(10),
      paddingHorizontal: scale(20),
    },
    flatlist: {
      marginTop: 40,
    },
    text: {
      fontWeight: '600',
      fontSize: moderateScale(15),
      flexShrink: 1,
      marginRight: scale(8),
      color: colors.text,
    },
    exclamationcircleo: {
      alignSelf: 'center',
    },
    reportText: {
      color: colors.linkColor,
      textDecorationLine: 'underline',
      fontSize: moderateScale(15),
      marginTop: 15,
      alignSelf: 'flex-start',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: colors.sheetBackground,
      padding: 20,
      borderRadius: 10,
      width: '85%',
      height: '50%',
    },
    modalTitle: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
      textAlign: 'center',
    },
    modalText: {
      fontSize: moderateScale(15),
      color: colors.text,
      lineHeight: 20,
      marginBottom: 15,
    },
    findoutButton: {
      backgroundColor: colors.headerBg,
      borderRadius: 20,
      padding: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    findoutButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: moderateScale(16),
    },
    closeButton: {marginTop: 17},
    closeButtonText: {
      textAlign: 'center', 
      fontSize: moderateScale(16), 
      fontWeight: '500',
      color: colors.text,
    },
    showMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      alignSelf: 'flex-start',
    },
    showMoreText: {
      color: colors.headerBg,
      marginRight: 5,
      fontSize: moderateScale(14),
      fontWeight: '500',
    },
  }), [colors, moderateScale, verticalScale, scale]);

  const renderReviewItem = ({item}) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Rating
        type="star"
        ratingCount={5}
        imageSize={17}
        readonly
        startingValue={parseFloat(item.rating)}
        tintColor={colors.card}
        ratingColor={colors.headerBg}
        ratingBackgroundColor="#c8c7c8"
        style={styles.rating}
      />
      <Text
        numberOfLines={expandedReviews[item.id] ? undefined : 3}
        style={styles.reviewText}>
        {item.review}
      </Text>
      {item.review.length > 150 && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => toggleReviewExpansion(item.id)}>
          <Text style={styles.showMoreText}>
            {expandedReviews[item.id] ? 'Show Less' : 'Show More'}
          </Text>
          <Icon
            name={expandedReviews[item.id] ? 'up' : 'down'}
            size={14}
            color={colors.headerBg}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity>
        <Text style={styles.reportText}>Report</Text>
      </TouchableOpacity>
    </View>
  );

  const InfoModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reviews on Lieferfood</Text>
          <Text style={styles.modalText}>
            All reviews come from Lieferando customers who've ordered from
            Restaurant Pizzeria Dhillon. Want to know more?
          </Text>
          <TouchableOpacity 
            style={styles.findoutButton} 
            onPress={() => navigation.navigate('Help')}>
            <Text style={styles.findoutButtonText}>Find out more</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}>
            <Text style={styles.closeButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>50+ Reviews</Text>
        <View style={{width: 24}} />
      </View>

      <InfoModal />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.background}}>
        <View style={styles.starratingview}>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={24}
            readonly
            startingValue={4.3}
            tintColor={colors.background}
            ratingColor={colors.headerBg}
            ratingBackgroundColor="#c8c7c8"
            style={styles.starrate}
          />
          <Text style={styles.mainrating}>4.3/5</Text>
        </View>

        <View style={styles.secondview}>
          <Text style={styles.text}>Based on the 50+ most recent reviews</Text>
          <TouchableOpacity
            style={styles.exclamationcircleo}
            onPress={() => setShowModal(true)}>
            <Icon name="exclamationcircleo" size={scale(17)} color={colors.headerBg} />
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.flatlist}
          data={data}
          renderItem={renderReviewItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </ScrollView>
    </View>
  );
};

export default Reviews;