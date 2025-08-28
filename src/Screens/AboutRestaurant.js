// AboutRestaurant.js
import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  SectionList,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Fontisto';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import Icon5 from 'react-native-vector-icons/Ionicons';
import Icon6 from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCart} from '../State/CartContext';
import {useTheme} from '../State/ThemeContext';

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const AboutRestaurant = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    totalItemsCount,
    calculateCartTotal,
    updateCartItem,
  } = useCart();
  const {getColors} = useTheme();
  const colors = getColors();

  // State Management
  const [selectedOption, setSelectedOption] = useState('delivery');
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sectionPositions, setSectionPositions] = useState([]);
  const [showTitles, setShowTitles] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState();
  const [expandedOptions, setExpandedOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionsSummary, setSelectedOptionsSummary] = useState([]);
  const [isAllergenModalVisible, setAllergenModalVisible] = useState(false);
  const [allergenInfo, setAllergenInfo] = useState('');
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);
  const [editingCartItemId, setEditingCartItemId] = useState(null);
  const [isFreeDeliveryModalVisible, setFreeDeliveryModalVisible] =
    useState(false);
  const [wasBelow50, setWasBelow50] = useState(true);

  // Refs
  const sectionListRef = useRef(null);
  const flatListRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const menuItemSheetRef = useRef(null);
  const sectionSheetRef = useRef();
  const scrollViewRef = useRef();

  // Reset quantity when a new menu item is selected
  useEffect(() => {
    setQuantity(1);
  }, [selectedMenuItem]);

  // Free delivery modal logic
  useEffect(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.basePrice + item.optionsTotal) * item.quantity,
      0,
    );

    if (subtotal >= 50 && wasBelow50) {
      setFreeDeliveryModalVisible(true);
      setWasBelow50(false);
    } else if (subtotal < 50) {
      setWasBelow50(true);
    }
  }, [cartItems, wasBelow50]);

  // Section Tracking
  const handleSectionLayout = (event, index) => {
    const {y} = event.nativeEvent.layout;
    setSectionPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = y;
      return newPositions;
    });
  };

  // Scroll Handlers
  useEffect(() => {
    if (flatListRef.current && activeSectionIndex !== null) {
      flatListRef.current.scrollToIndex({
        index: activeSectionIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [activeSectionIndex]);

  const handleSectionScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const stickyHeaderHeight = 50;

    let activeIndex = 0;
    for (let i = 0; i < sectionPositions.length; i++) {
      if (sectionPositions[i] <= offsetY + stickyHeaderHeight) {
        activeIndex = i;
      } else {
        break;
      }
    }
    setActiveSectionIndex(activeIndex);
    setShowTitles(offsetY > 200);
  };

  const handleTitlePress = index => {
    setSelectedIndex(index);
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 50,
      viewPosition: 0,
      animated: true,
    });
  };

  // Existing Data Arrays (truncated for brevity)
  const data = [
    {
      id: 1,
      detail:
        'Bestelle ein Product aus der Kategorie 2 fur 1 Aktion , um das 2. Product gratis zu erhalten! Discount wird beim Bezahlvorgang abgezogen.',
    },
    {
      id: 2,
      detail: 'Erhalte 15% auf die gesamte Bestellung im Warenkorb',
    },
    {
      id: 3,
      detail: 'Free delivert when you spend over 50 €',
    },
  ];

  const highlight = [
    {
      id: 1,
      dishname: 'Pizza Peperonwurst',
      originalprice: '12,99 €',
      discountprice: '11,43 €',
      discount: '12%',
      dishdetail: 'mit Peperoniwurst',
      originalKlein: '12,99 €',
      discountKlein: '11,43 €',
      originalGroB: '13,99 €',
      discountGroB: '12,99 €',
      originalFamily: '23,99 €',
      discountFamily: '21,00 €',
      originalParty: '29,99 €',
      discountParty: '26,99 €',
      Klein: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+1,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+1,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      GroB: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+3,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+3,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+3,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+2,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      Family: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+5,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+5,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+5,50 €',
        },
      ],
      Party: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+6,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+6,50 €',
        },
      ],
    },
    {
      id: 2,
      dishname: 'Pasta alla Panna',
      originalprice: '12,99 €',
      discountprice: '11,43 €',
      discount: '12%',
      dishdetail: 'mit Schinken-Sahnesauce',
      originalKlein: '12,99 €',
      discountKlein: '11,43 €',
      originalGroB: '13,99 €',
      discountGroB: '12,99 €',
      originalFamily: '23,99 €',
      discountFamily: '21,00 €',
      originalParty: '29,99 €',
      discountParty: '26,99 €',
      Klein: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+1,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+1,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      GroB: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+3,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+3,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+3,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+2,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      Family: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+5,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+5,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+5,50 €',
        },
      ],
      Party: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+6,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+6,50 €',
        },
      ],
    },
    {
      id: 3,
      dishname: 'Pizza Hawaii - GroB',
      originalprice: '13,99 €',
      discountprice: '12,31 €',
      discount: '12%',
      dishdetail: 'mit Artischocken, Oliven, paprika, Zucchini und Zwiebein',
      originalKlein: '13,99 €',
      discountKlein: '12,31 €',
      originalGroB: '14,99 €',
      discountGroB: '12,99 €',
      originalFamily: '23,99 €',
      discountFamily: '21,00 €',
      originalParty: '29,99 €',
      discountParty: '26,99 €',
      Klein: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+1,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+1,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      GroB: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+3,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+3,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+3,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+2,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      Family: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+5,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+5,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+5,50 €',
        },
      ],
      Party: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+6,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+6,50 €',
        },
      ],
    },
    {
      id: 4,
      dishname: 'Pizza Daddy',
      originalprice: '14,99 €',
      discountprice: '13,19 €',
      discount: '12%',
      dishdetail: 'mit frischen Tomaten, Mozzarella und Badilikum',
      originalKlein: '14,99 €',
      discountKlein: '13,19 €',
      originalGroB: '15,99 €',
      discountGroB: '13,99 €',
      originalFamily: '23,99 €',
      discountFamily: '21,00 €',
      originalParty: '29,99 €',
      discountParty: '26,99 €',
      Klein: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+1,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+1,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      GroB: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+3,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+3,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+3,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+2,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      Family: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+5,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+5,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+5,50 €',
        },
      ],
      Party: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+6,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+6,50 €',
        },
      ],
    },
    {
      id: 5,
      dishname: 'Pizza cheeseburger',
      originalprice: '16,99 €',
      discountprice: '15,31 €',
      discount: '12%',
      dishdetail: 'mit Rindfleisch-patty, Mozzarella und Spezialburgersauce',
      originalKlein: '16,99 €',
      discountKlein: '15,31 €',
      originalGroB: '17,99 €',
      discountGroB: '16,99 €',
      originalFamily: '23,99 €',
      discountFamily: '21,00 €',
      originalParty: '29,99 €',
      discountParty: '26,99 €',
      Klein: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+1,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+1,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      GroB: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+3,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+3,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+3,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+2,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      Family: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+5,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+5,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+5,50 €',
        },
      ],
      Party: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+6,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+6,50 €',
        },
      ],
    },
    {
      id: 6,
      dishname: 'Pizza Funghi',
      originalprice: '16,99 €',
      discountprice: '15,31 €',
      discount: '12%',
      dishdetail: 'mit Pilzen',
      originalKlein: '16,99 €',
      discountKlein: '15,31 €',
      originalGroB: '17,99 €',
      discountGroB: '16,99 €',
      originalFamily: '23,99 €',
      discountFamily: '21,00 €',
      originalParty: '29,99 €',
      discountParty: '26,99 €',
      Klein: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+1,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+1,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      GroB: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+3,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+3,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+3,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+2,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+1,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+1,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+1,50 €',
        },
      ],
      Family: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+2,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+2,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+2,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+5,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+5,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+5,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+5,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+5,50 €',
        },
      ],
      Party: [
        {
          topaddingdish: 'Ihr Sonderwunsch',
          insideaddingdish1: 'Mozzarella-Kaserand',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'American Style',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'ohne Tomatensauce',
          insideaddingdishprice3: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Extra',
          insideaddingdish1: 'Ananas',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Spinate',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Curry',
          insideaddingdishprice3: '+6,50 €',
          insideaddingdish4: 'Chili',
          insideaddingdishprice4: '+6,50 €',
        },
        {
          topaddingdish: 'Ihr Beilage',
          insideaddingdish1: 'Sucuk',
          insideaddingdishprice1: '+6,50 €',
          insideaddingdish2: 'Shrimps',
          insideaddingdishprice2: '+6,50 €',
          insideaddingdish3: 'Rucola',
          insideaddingdishprice3: '+6,50 €',
        },
      ],
    },
  ];

  const menulist = [
    {
      title: 'Italian Pizza Classic',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Margherita',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Pilzen',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Funghi',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Pilzen',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Salami',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Salami',
          discount: '12%',
          originalKlein: '16,99 €',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'Italian Pizza Vegetarisch',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Vegetaria',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Artischocken, Oliven, paprika, Zucchini und Zwiebein',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Gorgonzola',
          discountprice: '15,31 €',
          originalprice: '16,99 €',
          dishdetail: 'mit Gorgonzola und Spinat',
          discount: '12%',
          originalKlein: '16,99 €',
          discountKlein: '15,31 €',
          originalGroB: '17,99 €',
          discountGroB: '16,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Mozzarella',
          discountprice: '15,31 €',
          originalprice: '16,99 €',
          dishdetail: 'mit frischen Tomaten, Mozzarella und Badilikum',
          discount: '12%',
          originalKlein: '16,99 €',
          discountKlein: '15,31 €',
          originalGroB: '17,99 €',
          discountGroB: '16,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'American Burger',
      detail:
        'Alle Burger werden Rindfleisch mit Salat,Tomaten und sauren Gurken zubereitet. Normal mit 1× Fleisch patty. Doppeit mit 2× Fleisch patty',
      data: [
        {
          id: 1,
          dishname: 'Griechischer Burger',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Rindfleisch-patty, Mozzarella und Spezialburgersauce',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Veggie Burger',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Rindfleisch-patty, Mozzarella und Spezialburgersauce',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Veggie Burger',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Gemuse-Bratling',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'Italian Pizza Hot Mix',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Hot Ring',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Peperoniwurst, Paprika,Zwiebein und chili',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Hot Green',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Salami,Mais,Zwiebein,Peperoni un chili',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Hot di Mare',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Thunfisch, Shrimps,Salami und chili',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'Italian Pizza Barbecue',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Chicken BBQ',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Hahnchenfilet, frischen Zwiebeln, Jalapenos und Mozzarella',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza New York',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Hahnchenfilet, frischen Zwiebeln, Jalapenos und Mozzarella',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Los Angeles',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Hahnchenfilet, frischen Zwiebeln, Jalapenos und Mozzarella',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'Italian Pizza mit Hahnchen',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Polo',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Paprika, Hahnchenfilet und Zwiebeln',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Huhn',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Hahnchenfilet, frischen Zwiebeln, Jalapenos und Mozzarella',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Exotic',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Hahnchenfilet, Curry,Knoblauch und Paprika',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'Italian Pizza mit Fisch',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Alaturka',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Tomatensauce,kase, Thunfisch, milden Peperonis, Zwiebein und Weichase',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Gebze',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Tomatensauce,kase, Thunfisch, milden Peperonis, Zwiebein und Weichase',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Thunfisch',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Thunfisch',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
    {
      title: 'Italian Pizza Hollandaise',
      detail:
        'Auf Wunsch American Style, Extra Mozzarella im Pizzarand. Wahl: Klevin ca. 26cm, GroB ca. 30cm, Family ca. 45×32cm, Party 60×40cm. Alle Pizzen mit Tomatensauce und Kase(auf Wunsch auch ohne kase).',
      data: [
        {
          id: 1,
          dishname: 'Pizza Miami',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Tomatensauce,kase, Thunfisch, milden Peperonis, Zwiebein und Weichase',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Boston',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail:
            'mit Tomatensauce,kase, Thunfisch, milden Peperonis, Zwiebein und Weichase',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
        {
          id: 1,
          dishname: 'Pizza Seattle',
          discountprice: '11,43 €',
          originalprice: '12,99 €',
          dishdetail: 'mit Thunfisch',
          discount: '12%',
          originalKlein: '12,99 €',
          discountKlein: '11,43 €',
          originalGroB: '13,99 €',
          discountGroB: '12,99 €',
          originalFamily: '23,99 €',
          discountFamily: '21,00 €',
          originalParty: '29,99 €',
          discountParty: '26,99 €',
          Klein: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+1,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+1,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          GroB: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+3,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+3,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+3,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+2,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+1,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+1,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+1,50 €',
            },
          ],
          Family: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+2,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+2,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+2,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+5,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+5,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+5,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+5,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+5,50 €',
            },
          ],
          Party: [
            {
              topaddingdish: 'Ihr Sonderwunsch',
              insideaddingdish1: 'Mozzarella-Kaserand',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'American Style',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'ohne Tomatensauce',
              insideaddingdishprice3: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Extra',
              insideaddingdish1: 'Ananas',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Spinate',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Curry',
              insideaddingdishprice3: '+6,50 €',
              insideaddingdish4: 'Chili',
              insideaddingdishprice4: '+6,50 €',
            },
            {
              topaddingdish: 'Ihr Beilage',
              insideaddingdish1: 'Sucuk',
              insideaddingdishprice1: '+6,50 €',
              insideaddingdish2: 'Shrimps',
              insideaddingdishprice2: '+6,50 €',
              insideaddingdish3: 'Rucola',
              insideaddingdishprice3: '+6,50 €',
            },
          ],
        },
      ],
    },
  ];

  // Existing Modal and Sheet Components
  const toggleInfoModal = () => setInfoModalVisible(!isInfoModalVisible);

  const openStampCardsSheet = () => {
    bottomSheetRef.current.open();
  };

  const openMenuItemSheet = (item, isEditing = false, cartItem = null) => {
    if (isEditing && cartItem) {
      setSelectedMenuItem(cartItem.originalItem);
      setSelectedSize(cartItem.size);
      setQuantity(cartItem.quantity);
      setSelectedOptionsSummary(cartItem.options);
      setIsEditingCartItem(true);
      setEditingCartItemId(cartItem.id);
      setExpandedOptions(true);

      const newSelectedOptions = {};
      cartItem.options.forEach(option => {
        const key = `${cartItem.size}-${option.groupIndex}-${option.key}`;
        newSelectedOptions[key] = true;
      });
      setSelectedOptions(newSelectedOptions);
    } else {
      setSelectedMenuItem(item);
      setSelectedOptions({});
      setSelectedOptionsSummary([]);
      setSelectedSize(null);
      setIsEditingCartItem(false);
      setEditingCartItemId(null);
      setQuantity(1);
      setExpandedOptions(false);
    }

    menuItemSheetRef.current.open();
  };

  const handleOptionSelect = (
    size,
    groupIndex,
    optionKey,
    optionName,
    optionPrice,
  ) => {
    const uniqueKey = `${size}-${groupIndex}-${optionKey}`;
    const isSelected = !selectedOptions[uniqueKey];

    setSelectedOptions(prev => ({...prev, [uniqueKey]: isSelected}));

    if (isSelected) {
      setSelectedOptionsSummary(prev => [
        ...prev,
        {name: optionName, price: optionPrice, groupIndex, key: optionKey},
      ]);
    } else {
      setSelectedOptionsSummary(prev =>
        prev.filter(
          item => !(item.groupIndex === groupIndex && item.key === optionKey),
        ),
      );
    }
  };

  const openSectionsSheet = () => {
    sectionSheetRef.current.open();
  };

  const renderInfoModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isInfoModalVisible}
      onRequestClose={toggleInfoModal}>
      <View style={[styles.modalContainer, {backgroundColor: colors.modalBg}]}>
        <View style={[styles.modalContent, {backgroundColor: colors.card}]}>
          <Text style={[styles.modalTitle, {color: colors.text}]}>
            Delivery Fee
          </Text>
          <Text style={{color: colors.text}}>10 € minimum order</Text>
          <View style={styles.deliveryFeeRow}>
            <Text style={{fontWeight: 'bold', color: colors.text}}>
              Ordervalue*
            </Text>
            <Text style={{fontWeight: 'bold', color: colors.text}}>
              Delivery
            </Text>
          </View>
          <View style={styles.deliveryFeeRow}>
            <Text style={{color: colors.text}}>Under 50 € </Text>
            <Text style={{color: colors.text}}>2 € </Text>
          </View>
          <View style={styles.deliveryFeeRow}>
            <Text style={{color: colors.text}}>Over 50 € </Text>
            <Text style={{color: colors.text}}>Free</Text>
          </View>
          <Text style={{fontWeight: 'bold', marginTop: 15, color: colors.text}}>
            * Excluding offers, service fees and {'\n'} delivery fees
          </Text>
          <TouchableOpacity
            style={[styles.closeButton, {backgroundColor: colors.headerBg}]}
            onPress={toggleInfoModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAllergenModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isAllergenModalVisible}
      onRequestClose={() => setAllergenModalVisible(false)}>
      <View style={[styles.modalContainer, {backgroundColor: colors.modalBg}]}>
        <View style={[styles.modalContent, {backgroundColor: colors.card}]}>
          <Text style={[styles.modalTitle, {color: colors.text}]}>
            Allergy information
          </Text>
          <Text style={[styles.allergenInfoText, {color: colors.text}]}>
            {allergenInfo}
          </Text>
          <TouchableOpacity
            style={[styles.closeButton, {backgroundColor: colors.headerBg}]}
            onPress={() => setAllergenModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderFreeDeliveryModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isFreeDeliveryModalVisible}
      onRequestClose={() => setFreeDeliveryModalVisible(false)}>
      <View style={[styles.modalContainer, {backgroundColor: colors.modalBg}]}>
        <View
          style={[
            styles.freeDeliveryModalContent,
            {},
          ]}>
          <Text style={[styles.freeDeliveryModalTitle, {color: colors.text}]}>
            Congratulations!
          </Text>
          <Text style={[styles.freeDeliveryModalText, {color: colors.text}]}>
            Now your order is free!
          </Text>
          <Text style={[styles.freeDeliveryModalSubtext, {color: colors.text}]}>
            You've reached 50€ order value, so delivery is now free
          </Text>
          <TouchableOpacity
            style={[
              styles.freeDeliveryButton,
              {backgroundColor: colors.selectedSizeHeader},
            ]}
            onPress={() => setFreeDeliveryModalVisible(false)}>
            <Text style={styles.freeDeliveryButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderMenuItemBottomSheet = () => {
    const calculateTotalPrice = () => {
      if (!selectedMenuItem || !selectedSize) return 0;

      const basePrice = parseFloat(
        selectedMenuItem[`discount${selectedSize}`]
          .replace('€', '')
          .replace(',', '.')
          .trim(),
      );

      const optionsTotal = selectedOptionsSummary.reduce((total, option) => {
        const price = parseFloat(
          option.price
            .replace('+', '')
            .replace('€', '')
            .replace(',', '.')
            .trim(),
        );
        return total + price;
      }, 0);

      return (basePrice + optionsTotal) * quantity;
    };

    const getCartItemSignature = item => {
      return `${item.name}|${item.size}|${JSON.stringify(
        item.options.map(opt => opt.key).sort(),
      )}`;
    };

    const renderSizeOptions = () => {
      if (!selectedMenuItem) return null;
      const sizeData = selectedMenuItem[selectedSize];
      if (!sizeData) return null;

      return (
        <View style={styles.sizeOptionsContent}>
          {sizeData.map((optionGroup, groupIndex) => {
            const options = [];
            const keys = ['1', '2', '3', '4'];

            keys.forEach(key => {
              if (optionGroup[`insideaddingdish${key}`]) {
                options.push({
                  key,
                  name: optionGroup[`insideaddingdish${key}`],
                  price: optionGroup[`insideaddingdishprice${key}`],
                });
              }
            });

            return (
              <View key={groupIndex} style={styles.optionGroup}>
                <View style={styles.optionGroupHeader}>
                  <Text style={[styles.optionGroupTitle, {color: colors.text}]}>
                    {optionGroup.topaddingdish}
                  </Text>
                  <Text style={[styles.optionalText, {color: colors.text}]}>
                    optional
                  </Text>
                </View>
                {options.map((option, optionIndex) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleOptionSelect(
                        selectedSize,
                        groupIndex,
                        option.key,
                        option.name,
                        option.price,
                      )
                    }
                    key={option.key}
                    style={[
                      styles.optionItem,
                      optionIndex !== options.length - 1 &&
                        styles.optionItemBorder,
                    ]}>
                    <TouchableOpacity
                      style={[
                        styles.optionCheckbox,
                        selectedOptions[
                          `${selectedSize}-${groupIndex}-${option.key}`
                        ] && styles.optionCheckboxSelected,
                      ]}
                      onPress={() =>
                        handleOptionSelect(
                          selectedSize,
                          groupIndex,
                          option.key,
                          option.name,
                          option.price,
                        )
                      }>
                      {selectedOptions[
                        `${selectedSize}-${groupIndex}-${option.key}`
                      ] && <Icon name="check" size={16} color="white" />}
                    </TouchableOpacity>

                    <Text style={[styles.optionName, {color: colors.text}]}>
                      {option.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Infotopping')}
                      style={{
                        marginLeft: '10%',
                        alignContent: 'flex-start',
                        flex: 1,
                      }}>
                      <Feather name="info" size={20} color={colors.icon} />
                    </TouchableOpacity>
                    <Text style={[styles.optionPrice, {color: colors.text}]}>
                      {option.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </View>
      );
    };

    return (
      <RBSheet
        ref={menuItemSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
          closeOnPressBack={true}     
        draggable={true}
        height={'75%'}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
          draggableIcon: {backgroundColor: 'lightgray'},
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.sheetBackground,
          },
        }}>
        {selectedMenuItem && (
          <>
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                onPress={() => menuItemSheetRef.current.close()}
                style={styles.backButton}>
                <Icon name="arrowleft" size={25} color={colors.headerBg} />
              </TouchableOpacity>
              <Text
                style={[styles.sheetHeaderTitle, {color: colors.text}]}
                numberOfLines={1}>
                {selectedMenuItem.dishname}
              </Text>
              <TouchableOpacity style={{marginLeft: '15%'}}>
                <Feather name="share" size={25} color={colors.headerBg} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.menuItemSheetScrollContent}>
              <View style={styles.menuItemSheetContent}>
                <Text
                  style={[styles.sheetHeaderTitle1, {color: colors.text}]}
                  numberOfLines={1}>
                  {selectedMenuItem.dishname}
                </Text>
                <View style={styles.priceContainerSheet}>
                  <Text
                    style={[styles.discountPriceSheet, {color: colors.text}]}>
                    from {selectedMenuItem.discountprice}
                  </Text>
                  <Text
                    style={[styles.originalPriceSheet, {color: colors.text}]}>
                    {selectedMenuItem.originalprice}
                  </Text>
                  <View
                    style={[
                      styles.discountBadgeSheet,
                      {backgroundColor: colors.badgeBackground},
                    ]}>
                    <Text
                      style={[
                        styles.discountTextSheet,
                        {color: colors.badgeText},
                      ]}>
                      {selectedMenuItem.discount} off *
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.menuItemSheetDetail, {color: colors.text}]}>
                  {selectedMenuItem.dishdetail}
                </Text>
                <Text
                  style={[styles.menuItemSheetDetail1, {color: colors.text}]}>
                  * Discount applied at checkout
                </Text>

                <View
                  style={[
                    styles.sizeSelectionHeader,
                    selectedSize && {
                      backgroundColor: colors.selectedSizeHeader,
                    },
                  ]}>
                  <Text style={[styles.sizeHeaderText, {color: colors.text}]}>
                    Choose one
                  </Text>
                  {selectedSize ? (
                    <Icon name="check" size={20} color={colors.text} />
                  ) : (
                    <Text
                      style={[
                        styles.requiredtext,
                        {
                          backgroundColor: colors.requiredBadgeBackground,
                          color: colors.requiredBadgeText,
                        },
                      ]}>
                      Required
                    </Text>
                  )}
                </View>

                <View style={styles.sizeOptionsContainer}>
                  {['Klein', 'GroB', 'Family', 'Party'].map(size => (
                    <TouchableOpacity
                      key={size}
                      style={styles.sizeOption}
                      onPress={() => {
                        setSelectedOptions({});
                        setSelectedOptionsSummary([]);
                        setSelectedSize(size);
                        setExpandedOptions(true);

                        setTimeout(() => {
                          if (scrollViewRef.current) {
                            scrollViewRef.current.scrollTo({
                              y: height * 0.65,
                              animated: true,
                            });
                          }
                        }, 100);
                      }}>
                      <View style={styles.sizeRadio}>
                        {selectedSize === size && (
                          <View style={styles.sizeRadioInner} />
                        )}
                      </View>
                      <Text style={[styles.sizeLabel, {color: colors.text}]}>
                        {size}
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Infosize')}
                        style={{
                          marginRight: '5%',
                          alignContent: 'flex-start',
                          flex: 1,
                        }}>
                        <Feather name="info" size={20} color={colors.icon} />
                      </TouchableOpacity>
                      <View style={styles.sizePriceContainer}>
                        <Text
                          style={[
                            styles.sizeOriginalPrice,
                            {color: colors.text},
                          ]}>
                          {selectedMenuItem[`original${size}`]}
                        </Text>
                        <Text
                          style={[
                            styles.sizeDiscountPrice,
                            {color: colors.text},
                          ]}>
                          {selectedMenuItem[`discount${size}`]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {expandedOptions && renderSizeOptions()}
              </View>
            </ScrollView>

            <View
              style={[
                styles.bottomFixedContainer,
                {backgroundColor: colors.card, borderTopColor: colors.divider},
              ]}>
              {selectedSize && (
                <>
                  <View style={styles.quantitySelector}>
                    {quantity === 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          if (isEditingCartItem) {
                            removeFromCart(editingCartItemId);
                          }
                          menuItemSheetRef.current.close();
                        }}
                        style={styles.quantityButton}>
                        <Icon4
                          name="delete-outline"
                          size={24}
                          color={colors.text}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setQuantity(quantity - 1)}
                        style={styles.quantityButton}>
                        <Icon name="minus" size={20} color={colors.text} />
                      </TouchableOpacity>
                    )}

                    <Text style={[styles.quantityText, {color: colors.text}]}>
                      {quantity}
                    </Text>

                    <TouchableOpacity
                      onPress={() => setQuantity(quantity + 1)}
                      style={styles.quantityButton}>
                      <Icon name="plus" size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (isEditingCartItem) {
                        const updatedItem = {
                          id: editingCartItemId,
                          name: selectedMenuItem.dishname,
                          size: selectedSize,
                          options: selectedOptionsSummary,
                          quantity: quantity,
                          basePrice: parseFloat(
                            selectedMenuItem[`discount${selectedSize}`]
                              .replace('€', '')
                              .replace(',', '.')
                              .trim(),
                          ),
                          optionsTotal: selectedOptionsSummary.reduce(
                            (sum, opt) =>
                              sum +
                              parseFloat(
                                opt.price
                                  .replace('+', '')
                                  .replace('€', '')
                                  .replace(',', '.')
                                  .trim(),
                              ),
                            0,
                          ),
                          originalItem: selectedMenuItem,
                        };
                        updateCartItem(editingCartItemId, updatedItem);
                      } else {
                        const newItemSignature = `${
                          selectedMenuItem.dishname
                        }|${selectedSize}|${JSON.stringify(
                          selectedOptionsSummary.map(opt => opt.key).sort(),
                        )}`;

                        const existingItem = cartItems.find(
                          item =>
                            `${item.name}|${item.size}|${JSON.stringify(
                              item.options.map(opt => opt.key).sort(),
                            )}` === newItemSignature,
                        );

                        if (existingItem) {
                          updateCartItem(existingItem.id, {
                            ...existingItem,
                            quantity: existingItem.quantity + quantity,
                          });
                        } else {
                          addToCart(
                            selectedMenuItem,
                            selectedSize,
                            selectedOptionsSummary,
                            quantity,
                          );
                        }
                      }
                      menuItemSheetRef.current.close();
                    }}
                    style={[
                      styles.addToCartButton,
                      {backgroundColor: colors.headerBg},
                    ]}>
                    <View style={{flexDirection: 'row', gap: '10%'}}>
                      <Text style={styles.addToCartButtonText}>
                        {isEditingCartItem ? 'Update' : 'Add'}
                      </Text>
                      <Text style={styles.addToCartButtonText}>
                        {calculateTotalPrice().toFixed(2)} €
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </RBSheet>
    );
  };

  const renderSectionsBottomSheet = () => (
    <RBSheet
      ref={sectionSheetRef}
      draggable={true}
      closeOnDragDown={true}
        closeOnPressBack={true}     
      closeOnPressMask={true}
      height={600}
      customStyles={{
        wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
        draggableIcon: {backgroundColor: 'lightgray'},
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.sheetBackground,
        },
      }}>
      <View style={styles.sectionSheetContent}>
        <Text style={[styles.sectionSheetTitle, {color: colors.text}]}>
          Menu Sections
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={menulist}
          keyExtractor={(_, index) => index.toString()}
          style={{}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                styles.sectionSheetItem,
                {
                  backgroundColor:
                    index === selectedIndex ? 'red' : 'transparent',
                },
                {
                  borderRadius: index === selectedIndex ? 30 : 0,
                },
              ]}
              onPress={() => {
                handleTitlePress(index);
                sectionSheetRef.current.close();
              }}>
              <Text
                style={[
                  styles.sectionSheetItemText,
                  {
                    color: index === selectedIndex ? 'white' : colors.text,
                  },
                ]}>
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.sectionSheetItemText1,
                  {
                    color: index === selectedIndex ? 'white' : colors.text,
                  },
                ]}>
                {item.detail}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </RBSheet>
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        inactiveButton: {
          backgroundColor: 'transparent',
        },
        titlesContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          elevation: 10,
          paddingVertical: 10,
          paddingHorizontal: 8,
        },
        titleItem: {
          paddingHorizontal: 15,
          paddingVertical: 5,
          borderRadius: 20,
        },
        menuItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 13,
          alignItems: 'center',
          marginBottom: 10,
        },
        deliveryOptionsContainer: {},
        deliveryOptions: {
          flexDirection: 'row',
          backgroundColor: colors.tabBg,
          borderRadius: 35,
          alignSelf: 'center',
          padding: 2,
        },
        deliveryButton: {
          backgroundColor: colors.background,
          padding: 2,
          borderRadius: 30,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        deliveryText: {fontWeight: 'bold', color: colors.text},
        deliveryTime: {fontSize: moderateScale(12), color: colors.text},
        collectionButton: {
          backgroundColor: '#ddd',
          padding: 2,
          borderRadius: 30,
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
          paddingHorizontal: 12,
        },
        pizzapic: {height: 200, width: '100%', borderRadius: 20},
        pizzaview: {marginVertical: 15},
        headerContent: {
          position: 'absolute',
          bottom: 15,
          left: 10,
          right: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        },
        smallLogo: {
          height: 50,
          width: 50,
          padding: 10,
          borderRadius: 10,
          backgroundColor: colors.card,
        },
        groupOrder: {
          backgroundColor: colors.card,
          padding: 8,
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
        },
        groupOrderText: {
          marginLeft: 5,
          fontSize: moderateScale(12),
          fontWeight: 'bold',
          color: colors.text,
        },
        restaurantName: {
          fontSize: moderateScale(22),
          fontWeight: 'bold',
          marginBottom: 5,
          color: colors.text,
        },
        restaurantNameaboutview: {
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          flexDirection: 'row',
        },
        aboutUs: {flexDirection: 'row'},
        aboutusview: {
          backgroundColor: colors.choosebackground,
          borderRadius: 20,
          marginBottom: 15,
          paddingVertical: 8,
          gap: 6,
          alignSelf: 'center',
          paddingHorizontal: 10,
          flexDirection: 'row',
        },
        aboutustext: {fontWeight: 'bold', color: colors.text},
        ratingText: {
          fontSize: moderateScale(15),
          fontWeight: 'bold',
          color: colors.text,
        },
        starrattingview: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '5%',
        },
        starrattingview1: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '6%',
        },
        starrattingview2: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '6%',
        },
        modalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
          padding: 20,
          borderRadius: 10,
          width: '80%',
        },
        freeDeliveryModalContent: {
          padding: 25,
          borderRadius: 20,
          width: '85%',
          alignItems: 'center',
          backgroundColor:colors.deliveryfree,
          
        },
        freeDeliveryModalTitle: {
          fontSize: moderateScale(24),
          fontWeight: 'bold',
          marginBottom: 15,
          color: '#27ae60',
        },
        freeDeliveryModalText: {
          fontSize: moderateScale(20),
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 10,
        },
        freeDeliveryModalSubtext: {
          fontSize: moderateScale(16),
          textAlign: 'center',
          color: '#666',
          marginBottom: 25,
        },
        freeDeliveryButton: {
          borderRadius: 25,
          paddingVertical: 12,
          paddingHorizontal: 40,
          width: '100%',
        },
        freeDeliveryButtonText: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: moderateScale(18),
          textAlign: 'center',
        },
        modalTitle: {
          fontSize: moderateScale(20),
          fontWeight: 'bold',
          marginBottom: 10,
        },
        deliveryFeeRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors.tabBg,
          paddingVertical: 10,
          paddingHorizontal: 25,
          borderRadius: 20,
          marginTop: 5,
        },
        closeButton: {
          marginTop: 20,
          borderRadius: 20,
        },
        closeButtonText: {
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          paddingVertical: 10,
          fontSize: moderateScale(17),
        },
        yellowCard: {
          backgroundColor: colors.badgeBackground,
          borderRadius: 20,
          padding: 25,
          marginRight: 10,
          maxWidth: 300,
          maxHeight: 300,
          marginTop: 5,
        },
        offerText: {
          color: "",
          fontSize: moderateScale(16),
          fontWeight: 'bold',
        },
        stampview: {flexDirection: 'row', gap: 5},
        stamptext: {
          alignSelf: 'center',
          fontWeight: 'bold',
          fontSize: moderateScale(17),
          color: colors.text,
        },
        stampfindview: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 10,
          borderRadius: 10,
          paddingVertical: 10,
          marginTop: 18,
          width: '100%',
        },
        highlighttext: {
          fontWeight: 'bold',
          fontSize: moderateScale(18),
          marginTop: 20,
          color: colors.text,
        },
        highlighttopview: {
          paddingHorizontal: 10,
          paddingVertical: 20,
          borderRadius: 15,
          borderColor: colors.border,
          backgroundColor: colors.card,
          borderWidth: 1,
        },
        highlightinsideview: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 50,
        },
        dishnametext: {
          fontSize: moderateScale(16),
          fontWeight: 'bold',
          color: colors.text,
        },
        plus: {
          borderWidth: 0.5,
          borderColor: colors.border,
          textAlign: 'center',
          borderRadius: 100,
          padding: 4,
        },
        pricetext: {
          marginTop: 25,
          fontWeight: 'bold',
          fontSize: moderateScale(15),
          color: colors.text,
        },
        sectionHeader: {
          marginBottom: 15,
        },
        sectionTitleContainer: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: 8,
          marginTop: 30,
          flexWrap: 'wrap',
        },
        sectionTitle: {
          fontSize: moderateScale(20),
          fontWeight: 'bold',
          color: colors.text,
        },
        offerBadge: {
          backgroundColor: colors.badgeBackground,
          borderRadius: 10,
          paddingVertical: 3,
          paddingHorizontal: 8,
          marginLeft: 10,
        },
        offerBadgeText: {
          fontSize: moderateScale(14),
          color: colors.badgeText,
        },
        sectionDetail: {
          fontSize: moderateScale(14),
          color: colors.text,
          lineHeight: 20,
          marginBottom: 12,
        },
        separator: {
          height: 1,
          backgroundColor: colors.divider,
          marginBottom: 1,
        },
        menuItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 15,
        },
        lastMenuItem: {
          marginBottom: 30,
        },
        itemLeft: {
          flex: 1,
          marginRight: 15,
        },
        itemHeader: {
          flexDirection: 'row',
        },
        dishName: {
          fontSize: moderateScale(17),
          fontWeight: 'bold',
          flexShrink: 1,
          color: colors.text,
        },
        discountPrice: {
          fontSize: moderateScale(16),
          fontWeight: 'bold',
          color: colors.text,
        },
        priceContainer: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: 15,
          marginTop: 4,
        },
        originalPrice: {
          fontSize: moderateScale(16),
          textDecorationLine: 'line-through',
          marginRight: 8,
          color: colors.text,
        },
        dishDetail: {
          fontSize: moderateScale(14),
          color: colors.text,
          marginTop: 8,
          lineHeight: 20,
        },
        itemRight: {
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        },
        discountBadge: {
          backgroundColor: colors.badgeBackground,
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        discountText: {
          fontWeight: 'bold',
          fontSize: moderateScale(12),
          color: colors.badgeText,
        },
        plusButton: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          padding: 5,
        },
        itemSeparator: {
          height: 1,
          backgroundColor: colors.divider,
          marginVertical: 10,
        },
        sectionListContent: {
          paddingBottom: 30,
        },
        discounttext: {
          fontWeight: 'bold',
          fontSize: moderateScale(14),
          color: colors.text,
        },
        plusdiscountview: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: 10,
          marginTop: 12,
        },
        offericon: {
          backgroundColor: colors.badgeBackground,
          borderRadius: 40,
          padding: 3,
        },
        bottomSheetContent: {
          marginHorizontal: 20,
          marginVertical: 15,
        },
        bottomSheetTitle: {
          fontSize: moderateScale(22),
          fontWeight: 'bold',
          marginBottom: 15,
          textAlign: 'center',
          color: colors.text,
        },
        stampCardFooter: {
          fontSize: moderateScale(16),
          textAlign: 'center',
          color: colors.text,
        },
        closeSheetButton: {
          backgroundColor: colors.headerBg,
          borderRadius: 25,
          padding: 15,
          marginTop: 20,
        },
        closeSheetButtonText: {
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: moderateScale(16),
        },
        titletext: {
          fontWeight: 'bold',
          fontSize: moderateScale(16),
          color: colors.text,
        },
        stampdetailtext: {
          fontSize: moderateScale(15),
          paddingVertical: 10,
          color: colors.text,
        },
        sixtytext: {
          fontWeight: 'bold',
          fontSize: moderateScale(18),
          alignSelf: 'center',
          color: colors.text,
        },
        sixordertext: {
          alignSelf: 'center',
          fontSize: moderateScale(15),
          color: colors.text,
        },
        sixtext: {
          fontWeight: 'bold',
          color: 'red',
          fontSize: moderateScale(18),
        },
        stampdetailtext1: {
          fontSize: moderateScale(14),
          marginTop: 15,
          color: colors.text,
        },
        termconditiontext: {
          alignSelf: 'center',
          fontWeight: 'bold',
          textDecorationLine: 'underline',
          marginTop: 25,
          fontSize: moderateScale(16),
          color: colors.text,
        },
        menuItemSheetContent: {
          paddingHorizontal: 15,
          marginTop: 0,
          marginBottom: 50,
        },
        menuItemSheetTitle: {
          fontSize: moderateScale(22),
          fontWeight: 'bold',
          marginBottom: 10,
          alignSelf: 'center',
          color: colors.text,
        },
        menuItemSheetTitle0: {
          fontSize: moderateScale(16.5),
          fontWeight: '500',
          alignItems: 'center',
          flexShrink: 1,
          flexGrow: 0,
          color: colors.text,
        },
        menuItemSheetDetail: {
          fontSize: moderateScale(15),
          color: colors.text,
          marginBottom: 10,
          alignSelf: 'center',
        },
        menuItemSheetDetail1: {
          fontSize: moderateScale(14),
          color: colors.text,
          marginBottom: 20,
          alignSelf: 'center',
        },
        priceContainerSheet: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
          gap: 10,
          alignSelf: 'center',
          marginTop: 5,
        },
        discountPriceSheet: {
          fontSize: moderateScale(18),
          fontWeight: 'bold',
          color: colors.text,
        },
        originalPriceSheet: {
          fontSize: moderateScale(17),
          textDecorationLine: 'line-through',
          color: colors.text,
        },
        discountBadgeSheet: {
          backgroundColor: colors.badgeBackground,
          borderRadius: 10,
          paddingVertical: 3,
          paddingHorizontal: 8,
        },
        discountTextSheet: {
          fontSize: moderateScale(14),
          fontWeight: 'bold',
          color: colors.badgeText,
        },
        quantitySelector: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 0,
          alignItems: 'center',
          marginBottom: '6%',
        },
        quantityButton: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        },
        quantityButtonText: {},
        quantityText: {
          fontSize: moderateScale(18),
          fontWeight: 'bold',
          width: 40,
          textAlign: 'center',
          color: colors.text,
        },
        addToCartButton: {
          borderRadius: 25,
          padding: 10,
          paddingHorizontal: '3.5%',
          alignItems: 'center',
          marginTop: 12,
          marginBottom: '10%',
        },
        addToCartButtonText: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: moderateScale(16),
        },
        sizeOptionsContainer: {
          marginVertical: 20,
        },
        sizeOption: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },
        sizeRadio: {
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 1,
          borderColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        },
        sizeRadioInner: {
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: 'red',
        },
        sizeLabel: {
          flex: 1,
          fontSize: moderateScale(16.5),
          fontWeight: 'bold',
          marginLeft: 10,
          color: colors.text,
        },
        infoIcon: {
          marginRight: 160,
        },
        sizePriceContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        sizeOriginalPrice: {
          fontSize: moderateScale(15),
          textDecorationLine: 'line-through',
          color: colors.text,
          marginRight: 8,
        },
        sizeDiscountPrice: {
          fontSize: moderateScale(16),
          fontWeight: 'bold',
          color: colors.text,
        },
        sizeOptionsContent: {
          marginTop: 15,
        },
        optionGroup: {
          marginBottom: 20,
        },
        optionGroupTitle: {
          fontSize: moderateScale(19),
          fontWeight: 'bold',
          marginBottom: 10,
          color: colors.text,
        },
        optionItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          paddingVertical: 5,
        },
        optionCheckbox: {
          width: 20,
          height: 20,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
          borderColor: 'red',
          borderRadius: 4,
        },
        optionCheckboxSelected: {
          backgroundColor: 'red',
        },
        optionName: {
          flex: 1,
          fontSize: moderateScale(14),
          color: colors.text,
        },
        optionPrice: {
          fontSize: moderateScale(13.5),
          fontWeight: '400',
          color: colors.text,
        },
        optionInfo: {},
        optionGroupHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          paddingHorizontal: 5,
        },
        optionGroupTitle: {
          fontSize: moderateScale(16),
          fontWeight: 'bold',
          color: colors.text,
        },
        optionalText: {
          fontSize: moderateScale(14),
          color: colors.text,
        },
        optionItem: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 5,
        },
        optionItemBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },
        optionPrice: {
          fontSize: moderateScale(15),
          fontWeight: '500',
          color: colors.text,
          marginLeft: 10,
        },
        sizeOptionsContent: {
          marginTop: 15,
          paddingHorizontal: 10,
        },
        sizeSelectionHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors.choosebackground,
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 10,
        },
        titleText: {
          fontSize: moderateScale(15),
          fontWeight: 'bold',
          color: colors.text,
        },
        activeTitleItem: {
          borderRadius: 30,
          backgroundColor: colors.tabBg,
        },
        sectionlist: {marginHorizontal: 15},
        headerIcons: {
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
        },
        sectionIcon: {
          alignSelf: 'center',
           backgroundColor: '#f0f0f0',
          borderRadius: 20,
          padding: 5,
          elevation: 5,
          shadowColor: 'red',
        },
        sectionSheetContent: {
          padding: 25,
          flex: 1,
        },
        sectionSheetTitle: {
          fontSize: moderateScale(22),
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
          color: colors.text,
        },
        sectionSheetItem: {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },
        sectionSheetItemText: {
          fontSize: moderateScale(16),
          color: colors.text,
          fontWeight: 'bold',
        },
        sectionSheetItemText1: {
          fontSize: moderateScale(14),
          color: colors.text,
        },
        sheetHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
          marginBottom: 0,
          gap: '8%',
          marginHorizontal: 20,
          marginTop: 10,
        },
        sheetHeaderTitle: {
          fontSize: moderateScale(20),
          fontWeight: 'bold',
          flexShrink: 1,
        },
        requiredtext: {
          fontWeight: '500',
          padding: 2,
          borderRadius: 5,
        },
        menuItemSheetScrollContent: {
          paddingBottom: 130,
        },
        bottomFixedContainer: {
          position: 'absolute',
          bottom: '8.5%',
          left: 0,
          right: 0,
          backgroundColor: colors.card,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 0,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
        },
        sheetHeaderTitle1: {
          fontSize: moderateScale(18),
          fontWeight: 'bold',
          flex: 1,
          alignSelf: 'center',
          marginTop: '2.5%',
          color: colors.text,
        },

        // New cart styles
        cartItemContainer: {
          borderRadius: 8,
          padding: 5,
          paddingVertical: 5,
        },
        cartItemRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          borderRadius: 10,
          backgroundColor: colors.itembackground,
        },
        cartItemText: {
          fontSize: moderateScale(14),
          color: colors.text,
          flex: 1,
        },
        cartItemPrice: {
          fontSize: moderateScale(15),
          fontWeight: '500',
          marginLeft: 10,
          alignSelf: 'center',
          color: colors.text,
        },
        cartItemPrice1: {
          fontSize: moderateScale(15),
          fontWeight: '600',
          color: colors.requiredBadgeText,
          backgroundColor: colors.requiredBadgeBackground,
          borderRadius: 5,
          padding: 3,
        },
        cartSummaryContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.cartSummaryBg,
          padding: 10,
          paddingHorizontal: 20,
          borderRadius: 50,
          marginHorizontal: 5,
          marginBottom: '3%',
          paddingVertical: '2.5%',
        },
        cartIconContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        cartBadge: {
          backgroundColor:"white",
          borderRadius: 50,
          width: 28,
          height: 26,
          justifyContent: 'center',
          alignItems: 'center',
          top: '-70%',
          right: '50%',
        },
        badgeText: {
          color: colors.cartSummaryBg,
          fontSize: moderateScale(13),
          fontWeight: 'bold',
        },
        viewBasketText: {
          color: 'white',
          fontSize: moderateScale(16.5),
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center',
        },
        totalAmountText: {
          color: 'white',
          fontSize: moderateScale(16.5),
          fontWeight: 'bold',
        },
        exampleContainer: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 15,
          marginTop: 20,
        },
        exampleRow: {
          flexDirection: 'row',
          gap: 40,
          marginHorizontal: 20,
          marginVertical: 15,
          flexWrap: 'wrap',
        },
        divider: {
          borderBottomWidth: 1,
          borderColor: colors.divider,
          marginVertical: 10,
        },
        allergenInfoText: {
          fontSize: moderateScale(16),
          textAlign: 'center',
          marginVertical: 15,
          color: colors.text,
        },
        sizeHeaderText: {
          color: colors.text,
        },
      }),
    [colors],
  );

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top + 5,
        backgroundColor: colors.background,
      }}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('TabNavigation')}>
          <Icon name="arrowleft" size={28} color={colors.headerBg} />
        </TouchableOpacity>

        <View style={styles.deliveryOptionsContainer}>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryButton,
                selectedOption !== 'delivery' && styles.inactiveButton,
              ]}
              onPress={() => setSelectedOption('delivery')}>
              <FontAwesome
                name="motorcycle"
                size={22}
                color={colors.headerBg}
              />
              <View>
                <Text style={styles.deliveryText}>Delivery</Text>
                <Text style={styles.deliveryTime}>30-55 mins</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryButton,
                selectedOption !== 'pickup' && styles.inactiveButton,
              ]}
              onPress={() => setSelectedOption('pickup')}>
              <FontAwesome
                name="shopping-bag"
                size={22}
                color={colors.headerBg}
              />
              <View>
                <Text style={styles.deliveryText}>Collection</Text>
                <Text style={styles.deliveryTime}>15 mins</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchScreen', {highlight, menulist})
            }>
            <Icon name="search1" size={24} color={colors.headerBg} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sticky Section Titles */}
      {showTitles && (
        <View style={[styles.titlesContainer, {paddingTop: insets.top + 10}]}>
          <FlatList
            ref={flatListRef}
            data={menulist}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={[
                  styles.titleItem,
                  {
                    backgroundColor:
                      index === selectedIndex ? colors.headerBg : 'transparent',
                  },
                ]}
                onPress={() => handleTitlePress(index)}>
                <Text
                  style={[
                    styles.titleText,
                    {color: index === selectedIndex ? 'white' : colors.text},
                  ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View
            style={{backgroundColor: colors.background, paddingHorizontal: 10}}>
            <TouchableOpacity
              onPress={openSectionsSheet}
              style={styles.sectionIcon}>
              <Icon6
                name="format-list-bulleted"
                size={20}
                color={"red"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      <SectionList
        style={styles.sectionlist}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        ref={sectionListRef}
        sections={menulist}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item.id + index.toString()}
        onScroll={handleSectionScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            {/* Restaurant Header */}
            <View style={styles.pizzaview}>
              <Image
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2021/12/30/11/33/italian-cuisine-6903774_1280.jpg',
                }}
                style={styles.pizzapic}
              />
              <View style={styles.headerContent}>
                <Image
                  source={{
                    uri: 'https://img.freepik.com/free-vector/bakery-logo-template_441059-125.jpg',
                  }}
                  style={styles.smallLogo}
                />
                <TouchableOpacity style={styles.groupOrder}>
                  <Icon1
                    name="account-group"
                    size={18}
                    color={colors.headerBg}
                  />
                  <Text style={styles.groupOrderText}>Group order</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Restaurant Info */}
            <View style={styles.restaurantNameaboutview}>
              <Text style={styles.restaurantName}>
                Restaurant Pizzeria{'\n'}Dhillon
              </Text>
              <TouchableOpacity
                style={styles.aboutUs}
                onPress={() => navigation.navigate('Aboutus')}>
                <View style={styles.aboutusview}>
                  <Feather
                    name="info"
                    size={18}
                    color={colors.icon}
                    style={{alignItems: 'center', marginTop: '2%'}}
                  />
                  <Text style={styles.aboutustext}>About Us</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('Review')}>
                <View style={styles.starrattingview}>
                  <Icon name="star" size={19} color="#f43919" />
                  <Text style={styles.ratingText}>4.3 (50+)</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.starrattingview1}>
                <Icon2 name="dot-single" size={20} color={colors.icon} />
                <Text style={{marginLeft: -10, color: colors.text}}>
                  {' '}
                  Min. order 10 €
                </Text>
              </View>

              <View style={styles.starrattingview2}>
                <Icon2 name="dot-single" size={20} color={colors.icon} />
                <Text style={{marginLeft: -10, color: colors.text}}>
                  Delivery 0€ - 2€
                </Text>
                <TouchableOpacity onPress={toggleInfoModal}>
                  <Feather
                    name="info"
                    size={18}
                    color={colors.icon}
                    style={{alignSelf: 'centre', marginTop: '5%'}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Offers */}
            <FlatList
              data={data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.yellowCard}>
                  <Text style={styles.offerText}>{item.detail}</Text>
                </View>
              )}
              contentContainerStyle={{marginTop: 15}}
            />

            {/* Stamp Cards */}
            <TouchableOpacity onPress={openStampCardsSheet}>
              <View style={styles.stampfindview}>
                <View style={styles.stampview}>
                  <Text>
                    <Icon3
                      name="shopping-sale"
                      size={28}
                      color={colors.headerBg}
                    />
                  </Text>
                  <Text style={styles.stamptext}>StampCards</Text>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <Text style={{color: colors.text}}>Find out more</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Highlights */}
            <View>
              <Text style={styles.highlighttext}>Highlights</Text>
              <FlatList
                data={highlight}
                horizontal
                ItemSeparatorComponent={() => <View style={{width: 20}} />}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                style={{}}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => openMenuItemSheet(item)}>
                    <View style={styles.highlighttopview}>
                      <View style={styles.highlightinsideview}>
                        <Text style={styles.dishnametext}>{item.dishname}</Text>
                        <TouchableOpacity
                          onPress={() => openMenuItemSheet(item)}>
                          <Icon name="plus" size={22} color={colors.headerBg} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.pricetext}>{item.discountprice}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{marginTop: 15}}
              />
            </View>
          </>
        }
        renderSectionHeader={({section, sectionIndex}) => (
          <View
            onLayout={event => handleSectionLayout(event, sectionIndex)}
            style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>Offer</Text>
              </View>
            </View>
            <Text style={styles.sectionDetail}>{section.detail}</Text>
            <View style={styles.separator} />
          </View>
        )}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity onPress={() => openMenuItemSheet(item)}>
              <View style={styles.menuItem}>
                <View style={styles.itemLeft}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.dishName}>{item.dishname}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.discountPrice}>
                      from {item.discountprice}
                    </Text>
                    <Text style={styles.originalPrice}>
                      {item.originalprice}
                    </Text>
                  </View>
                  <Text style={styles.dishDetail}>{item.dishdetail}</Text>
                  <View style={styles.plusdiscountview}>
                    <Text style={styles.offericon}>
                      <Icon4
                        name="local-offer"
                        size={16}
                        color={colors.black}
                      />
                    </Text>
                    <Text style={[styles.discounttext, {color: colors.text}]}>
                      {item.discount} off
                    </Text>
                  </View>
                </View>

                <View style={styles.itemRight}>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => openMenuItemSheet(item)}>
                    <Icon name="plus" size={22} color={colors.headerBg} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Display cart items for this dish */}
            {cartItems
              .filter(cartItem => cartItem.name === item.dishname)
              .map(cartItem => (
                <TouchableOpacity
                  key={cartItem.id}
                  onPress={() => openMenuItemSheet(null, true, cartItem)}
                  style={styles.cartItemContainer}>
                  <View style={styles.cartItemRow}>
                    <Text style={styles.cartItemText}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 15,
                          color: 'grey',
                        }}>
                        {cartItem.size}
                      </Text>
                      {'\n'}
                      {cartItem.options.map(opt => opt.name).join(', ')}
                    </Text>
                    <Text style={styles.cartItemPrice}>
                      {(
                        (cartItem.basePrice + cartItem.optionsTotal) *
                        cartItem.quantity
                      ).toFixed(2)}{' '}
                      €
                    </Text>
                    <View style={{marginLeft: 15, justifyContent: 'center'}}>
                      <Text
                        style={[
                          styles.cartItemPrice1,
                          {
                            backgroundColor: colors.badgeBackground,
                            color: colors.badgeText,
                          },
                        ]}>
                        {' '}
                        {cartItem.quantity}{' '}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

      {/* Cart Summary Bar */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartSummaryContainer}
          onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cartIconContainer}>
            <FontAwesome6 name="basket-shopping" size={28} color="white" />
            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>{totalItemsCount}</Text>
            </View>
          </View>
          <Text style={styles.viewBasketText}>View Basket</Text>
          <Text style={styles.totalAmountText}>
            {calculateCartTotal().toFixed(2)} €
          </Text>
        </TouchableOpacity>
      )}

      {/* Bottom Sheets */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
          closeOnPressBack={true}     
        closeOnPressMask={true}
        draggable={true}
        duration={250}
        height={500}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
          draggableIcon: {backgroundColor: 'lightgray'},
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.sheetBackground,
          },
        }}>
        <ScrollView>
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Stamp Cards</Text>

            <View style={{marginTop: 20}}>
              <Text style={styles.titletext}>How it works</Text>
              <Text style={styles.stampdetailtext}>
                Order <Text style={{fontWeight: 'bold'}}>5 times</Text> from a
                participating restaurant to get a discount worth{' '}
                <Text style={{fontWeight: 'bold'}}>10%</Text> of the last 5
                order's total spend.
              </Text>
              <Text style={styles.stampdetailtext}>
                On your 6th order, your discount will be available to claim in
                your basket.
              </Text>
              <Text style={styles.titletext}>Example</Text>
              <View style={styles.exampleContainer}>
                <View style={styles.exampleRow}>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i}>
                          <Icon5
                            name="bag-handle-outline"
                            size={25}
                            color={colors.text}
                          />
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.sixordertext}>
                      Total spend on 5 orders
                    </Text>
                  </View>
                  <Text style={styles.sixtytext}>= 60,00 €</Text>
                </View>
                <View style={styles.divider}></View>
                <View style={styles.exampleRow}>
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <Text>
                      <Icon3
                        name="shopping-sale"
                        size={30}
                        color={colors.headerBg}
                      />
                    </Text>
                    <Text style={styles.sixordertext}>6th order discount</Text>
                  </View>
                  <Text style={styles.sixtext}>= 6,00 €</Text>
                </View>
              </View>
            </View>
            <Text style={styles.stampdetailtext1}>
              you can only earn stamps and redeem rewards with online payment
              methods.
            </Text>
            <TouchableOpacity>
              <Text style={styles.termconditiontext}>
                See Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>

      {renderSectionsBottomSheet()}
      {renderMenuItemBottomSheet()}
      {renderInfoModal()}
      {renderAllergenModal()}
      {renderFreeDeliveryModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  titlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  titleItem: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryOptionsContainer: {},
  deliveryOptions: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 35,
    alignSelf: 'center',
    padding: 2,
  },
  deliveryButton: {
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 30,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {fontWeight: 'bold', color: '#000'},
  deliveryTime: {fontSize: moderateScale(12), color: 'black'},
  collectionButton: {
    backgroundColor: '#ddd',
    padding: 2,
    borderRadius: 30,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  pizzapic: {height: 200, width: '100%', borderRadius: 20},
  pizzaview: {marginVertical: 15},
  headerContent: {
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  smallLogo: {
    height: 50,
    width: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  groupOrder: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupOrderText: {
    marginLeft: 5,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  restaurantName: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantNameaboutview: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  aboutUs: {flexDirection: 'row'},
  aboutusview: {
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginBottom: 15,
    paddingVertical: 8,
    gap: 6,
    alignSelf: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  aboutustext: {fontWeight: 'bold'},
  ratingText: {fontSize: moderateScale(15), fontWeight: 'bold'},
  starrattingview: {flexDirection: 'row', alignItems: 'center', gap: '5%'},
  starrattingview1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6%',
  },
  starrattingview2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  freeDeliveryModalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
  },
  freeDeliveryModalTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#27ae60',
  },
  freeDeliveryModalText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  freeDeliveryModalSubtext: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
  },
  freeDeliveryButton: {
    backgroundColor: '#27ae60',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
  },
  freeDeliveryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deliveryFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: moderateScale(17),
  },
  yellowCard: {
    backgroundColor: '#F4C430',
    borderRadius: 20,
    padding: 25,
    marginRight: 10,
    maxWidth: 300,
    maxHeight: 300,
    marginTop: 5,
  },
  offerText: {
    color: '#000',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  stampview: {flexDirection: 'row', gap: 5},
  stamptext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: moderateScale(17),
  },
  stampfindview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 18,
    width: '100%',
  },
  highlighttext: {
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    marginTop: 20,
  },
  highlighttopview: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 15,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  highlightinsideview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 50,
  },
  dishnametext: {fontSize: moderateScale(16), fontWeight: 'bold'},
  plus: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    textAlign: 'center',
    borderRadius: 100,
    padding: 4,
  },
  pricetext: {marginTop: 25, fontWeight: 'bold', fontSize: moderateScale(15)},
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 30,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  offerBadge: {
    backgroundColor: '#F4C430',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  offerBadgeText: {
    fontSize: moderateScale(14),
  },
  sectionDetail: {
    fontSize: moderateScale(14),
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  lastMenuItem: {
    marginBottom: 30,
  },
  itemLeft: {
    flex: 1,
    marginRight: 15,
  },
  itemHeader: {
    flexDirection: 'row',
  },
  dishName: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    flexShrink: 1,
  },
  discountPrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    marginTop: 4,
  },
  originalPrice: {
    fontSize: moderateScale(16),
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  dishDetail: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  discountBadge: {
    backgroundColor: '#F4C430',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  plusButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 5,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  sectionListContent: {
    paddingBottom: 30,
  },
  discounttext: {fontWeight: 'bold', fontSize: moderateScale(14)},
  plusdiscountview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  offericon: {backgroundColor: '#F4C430', borderRadius: 40, padding: 3},
  bottomSheetContent: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  bottomSheetTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  stampCardFooter: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#666',
  },
  closeSheetButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
  },
  closeSheetButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  titletext: {fontWeight: 'bold', fontSize: moderateScale(16)},
  stampdetailtext: {fontSize: moderateScale(15), paddingVertical: 10},
  sixtytext: {
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    alignSelf: 'center',
  },
  sixordertext: {alignSelf: 'center', fontSize: moderateScale(15)},
  sixtext: {fontWeight: 'bold', color: 'red', fontSize: moderateScale(18)},
  stampdetailtext1: {fontSize: moderateScale(14), marginTop: 15},
  termconditiontext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 25,
    fontSize: moderateScale(16),
  },
  menuItemSheetContent: {
    paddingHorizontal: 15,
    marginTop: 0,
    marginBottom: 50,
  },
  menuItemSheetTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  menuItemSheetTitle0: {
    fontSize: moderateScale(16.5),
    fontWeight: '500',
    alignItems: 'center',
    flexShrink: 1,
    flexGrow: 0,
  },
  menuItemSheetDetail: {
    fontSize: moderateScale(15),
    color: '#666',
    marginBottom: 10,
    alignSelf: 'center',
  },
  menuItemSheetDetail1: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: 20,
    alignSelf: 'center',
  },
  priceContainerSheet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 10,
    alignSelf: 'center',
    marginTop: 5,
  },
  discountPriceSheet: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  originalPriceSheet: {
    fontSize: moderateScale(17),
    textDecorationLine: 'line-through',
    color: '#666',
  },
  discountBadgeSheet: {
    backgroundColor: '#F4C430',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  discountTextSheet: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 0,
    alignItems: 'center',
    marginBottom: '6%',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {},
  quantityText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: '3.5%',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: '10%',
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  sizeOptionsContainer: {
    marginVertical: 20,
  },
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sizeRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  sizeLabel: {
    flex: 1,
    fontSize: moderateScale(16.5),
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoIcon: {
    marginRight: 160,
  },
  sizePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeOriginalPrice: {
    fontSize: moderateScale(15),
    textDecorationLine: 'line-through',
    color: '#666',
    marginRight: 8,
  },
  sizeDiscountPrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  sizeOptionsContent: {
    marginTop: 15,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionGroupTitle: {
    fontSize: moderateScale(19),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderColor: 'red',
    borderRadius: 4,
  },
  optionCheckboxSelected: {
    backgroundColor: 'red',
  },
  optionName: {
    flex: 1,
    fontSize: moderateScale(14),
  },
  optionPrice: {
    fontSize: moderateScale(13.5),
    fontWeight: '400',
    color: 'black',
  },
  optionInfo: {},
  optionGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  optionGroupTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  optionalText: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  optionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionPrice: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  sizeOptionsContent: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  sizeSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  titleText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  activeTitleItem: {
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  sectionlist: {marginHorizontal: 15},
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  sectionIcon: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    shadowColor: 'red',
  },
  sectionSheetContent: {
    padding: 25,
    flex: 1,
  },
  sectionSheetTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionSheetItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionSheetItemText: {
    fontSize: moderateScale(16),
    color: '#333',
    fontWeight: 'bold',
  },
  sectionSheetItemText1: {
    fontSize: moderateScale(14),
    color: 'grey',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 0,
    gap: '8%',
    marginHorizontal: 20,
    marginTop: 10,
  },
  sheetHeaderTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  requiredtext: {
    fontWeight: '500',
    backgroundColor: 'black',
    color: 'white',
    padding: 2,
    borderRadius: 5,
  },
  menuItemSheetScrollContent: {
    paddingBottom: 130,
  },
  bottomFixedContainer: {
    position: 'absolute',
    bottom: '8.5%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderTopWidth: 1,
    borderTopColor: '#eeee',
  },
  sheetHeaderTitle1: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    flex: 1,
    alignSelf: 'center',
    marginTop: '2.5%',
  },

  // New cart styles
  cartItemContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 5,
    paddingVertical: 5,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  cartItemText: {
    fontSize: moderateScale(14),
    color: '#555',
    flex: 1,
  },
  cartItemPrice: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    marginLeft: 10,
    alignSelf: 'center',
  },
  cartItemPrice1: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 3,
  },
  cartSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginHorizontal: 5,
    marginBottom: '3%',
    paddingVertical: '2.5%',
  },
  cartIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: 28,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-70%',
    right: '50%',
  },
  badgeText: {
    color: 'red',
    fontSize: moderateScale(13),
    fontWeight: 'bold',
  },
  viewBasketText: {
    color: 'white',
    fontSize: moderateScale(16.5),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  totalAmountText: {
    color: 'white',
    fontSize: moderateScale(16.5),
    fontWeight: 'bold',
  },
  exampleContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    marginTop: 20,
  },
  exampleRow: {
    flexDirection: 'row',
    gap: 40,
    marginHorizontal: 20,
    marginVertical: 15,
    flexWrap: 'wrap',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
  },
  allergenInfoText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginVertical: 15,
  },
});

export default AboutRestaurant;
