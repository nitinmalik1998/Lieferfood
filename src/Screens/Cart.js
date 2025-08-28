import React, {useReducer, useRef, useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native'
import BottomSheet from 'react-native-raw-bottom-sheet';
import {useCart} from "../State/CartContext"
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => {
  if (typeof size === 'undefined') return 0;
  return Math.round((width / guidelineBaseWidth) * size);
};

const verticalScale = size => {
  if (typeof size === 'undefined') return 0;
  return (height / guidelineBaseHeight) * size;
};

const moderateScale = (size, factor = 0.5) => {
  if (typeof size === 'undefined') return 0;
  return Math.round(size + (scale(size) - size) * factor);
};

const ACTIONS = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  UPDATE_NOTE: 'update_note',
  REMOVE_ITEM: 'remove_item',
  RESET: 'reset'
};

const dishReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      return state.map(dish =>
        dish.id === action.payload ? {...dish, quantity: dish.quantity + 1} : dish,
      );
    case ACTIONS.DECREMENT:
      return state.map(dish =>
        dish.id === action.payload
          ? {...dish, quantity: Math.max(1, dish.quantity - 1)}
          : dish,
      );
    case ACTIONS.REMOVE_ITEM:
      return state.filter(dish => dish.id !== action.payload);
    case ACTIONS.UPDATE_NOTE:
      return state.map(dish =>
        dish.id === action.payload.id 
          ? {...dish, note: action.payload.note} 
          : dish
      );
    case ACTIONS.RESET:
      return action.payload;
    default:
      return state;
  }
};

const Cart = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    addToCart,
    updateNote,
    updateCartItem
  } = useCart();
  
  // Get theme colors
  const { theme, getColors } = useTheme();
  const colors = getColors();
  
  // Convert cartItems to reducer format
  const initialDishes = cartItems.map(item => {
    const price = item.discount?.label === "Special Offer"
      ? (item.basePrice + item.optionsTotal) * (1 - item.discount.percentage / 100)
      : item.basePrice + item.optionsTotal;
    
    return {
      id: item.id,
      name: item.name,
      originalPrice: item.originalBasePrice || item.basePrice + item.optionsTotal,
      price: price,
      quantity: item.quantity,
      details: item.options.map(opt => opt.name),
      size: item.size,
      note: item.note || '',
      discount: item.discount || null,
      originalItem: item.originalItem,
      options: item.options,
      basePrice: item.basePrice,
      optionsTotal: item.optionsTotal
    };
  });

  const [dishes, dispatch] = useReducer(dishReducer, initialDishes);
  const [selectedOption, setSelectedOption] = useState('delivery');
  const [noteText, setNoteText] = useState('');
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [currentModalType, setCurrentModalType] = useState(null);
  const bottomSheetRef = useRef(null);
  const infoBottomSheetRef = useRef(null);
  const menuItemSheetRef = useRef(null);
  const specialOfferSheetRef = useRef(null);
  const scrollViewRef = useRef();

  // State for editing item
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedSpecialOffer, setSelectedSpecialOffer] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedSize, setSelectedSize] = useState();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionsSummary, setSelectedOptionsSummary] = useState([]);
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);
  const [editingCartItemId, setEditingCartItemId] = useState(null);
  const [editingSpecialOfferItem, setEditingSpecialOfferItem] = useState(null);

  const specialOffers = [
    {id: 'special-101', name: 'Special Bruschetta', price: 6.90, discountPercentage: 12},
    {id: 'special-102', name: 'Tiramisu', price: 5.90, discountPercentage: 12},
    {id: 'special-103', name: 'Speciali Bruscheeta water solid', price: 5.90, discountPercentage: 12},
  ];

  const specialOffers1 = [
    {id: 'special-101', name: 'pils 0,5 l (18+) 🔞', price: 3.70, discountPercentage: 12},
    {id: 'special-102', name: 'Coca-Cola 1,0 l', price: 4.50, discountPercentage: 12},
    {id: 'special-103', name: 'Red Bull 0,25 l', price: 4.40, discountPercentage: 12},
    {id: 'special-104', name: 'Fanta 1,0 l', price: 4.20, discountPercentage: 12},
  ];

  useEffect(() => {
    const newDishes = cartItems.map(item => {
      const price = item.discount?.label === "Special Offer"
        ? (item.basePrice + item.optionsTotal) * (1 - item.discount.percentage / 100)
        : item.basePrice + item.optionsTotal;
      
      const existingDish = dishes.find(d => d.id === item.id);
      
      return {
        id: item.id,
        name: item.name,
        originalPrice: item.originalBasePrice || item.basePrice + item.optionsTotal,
        price: price,
        quantity: item.quantity,
        details: item.options.map(opt => opt.name),
        size: item.size,
        note: existingDish ? existingDish.note : item.note || '',
        discount: item.discount || null,
        originalItem: item.originalItem,
        options: item.options,
        basePrice: item.basePrice,
        optionsTotal: item.optionsTotal
      };
    });
    dispatch({ type: ACTIONS.RESET, payload: newDishes });
  }, [cartItems]);

  const subtotal = dishes.reduce(
    (sum, dish) => sum + dish.price * dish.quantity,
    0,
  );
  
  const isSpecialOfferEligible = subtotal >= 10;
  const discountAmount = isSpecialOfferEligible ? subtotal * 0.12 : 0;
  const serviceFee = Math.min(0.99, (subtotal - discountAmount) * 0.025);
  const deposit = dishes.length * 0.15;
  const foodTotal = subtotal - discountAmount;
  
  // Delivery fee calculation: 2€ if subtotal < 50, else 0€
  const deliveryFee = selectedOption === 'delivery' 
    ? (subtotal < 50 ? 2 : 0)
    : 0;
  
  const total = subtotal - discountAmount + serviceFee + deposit + deliveryFee;

  const handleOpenNoteSheet = (dishId) => {
    setSelectedDishId(dishId);
    const dish = dishes.find(d => d.id === dishId);
    setNoteText(dish?.note || '');
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
  };

  const handleSaveNote = () => {
    dispatch({
      type: ACTIONS.UPDATE_NOTE,
      payload: { id: selectedDishId, note: noteText }
    });
    updateNote(selectedDishId, noteText);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const handleRemoveItem = (id) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
    removeFromCart(id);
  };

  const buildBreakdownData = () => {
    const data = [];
    
    data.push({
      label: 'Subtotal',
      value: `${subtotal.toFixed(2)} €`,
      type: 'regular'
    });
    
    if (isSpecialOfferEligible) {
      data.push({
        label: 'Special Offer Applied',
        value: `-${discountAmount.toFixed(2)} €`,
        type: 'discount'
      });
    }
    
    data.push({
      label: 'Service fee 2.5% (max 0.99 €)',
      value: `${serviceFee.toFixed(2)} €`,
      type: 'regular',
      hasInfo: true,
      infoType: 'serviceFee'
    });
    
    data.push({
      label: `Deposit 0,15 € X ${dishes.length}`,
      value: `${deposit.toFixed(2)} €`,
      type: 'regular',
      hasInfo: true,
      infoType: 'deposit'
    });
    
    data.push({
      label: 'Delivery fee',
      value: `${deliveryFee.toFixed(2)} €`,
      type: 'regular',
      hasInfo: true,
      infoType: 'deliveryFee'
    });
    
    data.push({
      label: 'Total',
      value: `${total.toFixed(2)} €`,
      type: 'total'
    });
    
    return data;
  };

  const handleOpenInfoModal = (infoType) => {
    setCurrentModalType(infoType);
    if (infoBottomSheetRef.current) {
      infoBottomSheetRef.current.open();
    }
  };

  const renderInfoModalContent = () => {
    switch (currentModalType) {
      case 'serviceFee':
        return (
          <View style={styles(colors).modalContent}>
            <Text style={[styles(colors).modalTitle, {color: colors.text}]}>Service fee 2.5% (max 0.99 €)</Text>
            <Text style={[styles(colors).modalDescription, {color: colors.text}]}>
              This allows us to provide and keep improving our service (including customer care) and user experience (including continuing to widen the choice of partners available to you).
            </Text>
            <TouchableOpacity 
              style={styles(colors).modalButton}
              onPress={() => {
                if (infoBottomSheetRef.current) {
                  infoBottomSheetRef.current.close();
                }
              }}
            >
              <Text style={styles(colors).modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'deposit':
        return (
          <View style={styles(colors).modalContent}>
            <Text style={[styles(colors).modalTitle, {color: colors.text}]}>Deposit</Text>
            <Text style={[styles(colors).modalDescription, {color: colors.text}]}>
              When you buy drinks in disposable or reusable containers, you pay a small deposit fee. You can get the deposit back by returning the containers at recycling machines in most supermarkets.
            </Text>
            <TouchableOpacity 
              style={styles(colors).modalButton}
              onPress={() => {
                if (infoBottomSheetRef.current) {
                  infoBottomSheetRef.current.close();
                }
              }}
            >
              <Text style={styles(colors).modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'deliveryFee':
        return (
          <View style={styles(colors).modalContent}>
            <Text style={[styles(colors).modalTitle, {color: colors.text}]}>Delivery fee</Text>
            <Text style={[styles(colors).modalDescription, {color: colors.text}]}>
              This contributes to the costs of delivery to you. It can vary depending on e.g. your distance from the store, selected store, order value and, sometimes, time of day.
            </Text>
            
            <Text style={[styles(colors).sectionTitle, {color: colors.text}]}>10 € minimum order</Text>
            
            <View style={styles(colors).feeRow}>
              <Text style={[styles(colors).feeLabel, {color: colors.text}]}>Under 50 €</Text>
              <Text style={[styles(colors).feeValue, {color: colors.text}]}>2 €</Text>
            </View>
            
            <View style={styles(colors).feeRow}>
              <Text style={[styles(colors).feeLabel, {color: colors.text}]}>Over 50 €</Text>
              <Text style={[styles(colors).feeValue, {color: colors.text}]}>Free</Text>
            </View>
            
            <Text style={[styles(colors).noteText, {color: colors.text}]}>Excluding offers, service fees and delivery fees</Text>
            
            <TouchableOpacity 
              style={styles(colors).modalButton}
              onPress={() => {
                if (infoBottomSheetRef.current) {
                  infoBottomSheetRef.current.close();
                }
              }}
            >
              <Text style={styles(colors).modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  const handleSpecialOfferPress = (offer) => {
    setSelectedSpecialOffer(offer);
    setQuantity(1);
    setEditingSpecialOfferItem(null);
    if (specialOfferSheetRef.current) {
      specialOfferSheetRef.current.open();
    }
  };

  const handleEditSpecialOffer = (cartItem) => {
    const offer = {
      id: cartItem.originalItem?.id || cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      discountPercentage: cartItem.discount.percentage,
      originalPrice: cartItem.originalPrice
    };
    setSelectedSpecialOffer(offer);
    setQuantity(cartItem.quantity);
    setEditingSpecialOfferItem(cartItem);
    if (specialOfferSheetRef.current) {
      specialOfferSheetRef.current.open();
    }
  };

  const renderSpecialOfferBottomSheet = () => {
    if (!selectedSpecialOffer) return null;
    
    const isEditing = !!editingSpecialOfferItem;
    const originalPrice = selectedSpecialOffer.originalPrice || 
                         (selectedSpecialOffer.price / (1 - selectedSpecialOffer.discountPercentage/100));
    
    return (
      <BottomSheet
        ref={specialOfferSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
          closeOnPressBack={true}     
        draggable={true}
        height={'50%'}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
          draggableIcon: {backgroundColor: 'lightgray'},
          container: {borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colors.sheetBackground},
        }}>
        <View style={styles(colors).sheetHeader}>
          <TouchableOpacity
            onPress={() => {
              if (specialOfferSheetRef.current) {
                specialOfferSheetRef.current.close();
              }
              setEditingSpecialOfferItem(null);
            }}
            style={styles(colors).backButton}>
            <Icon name="arrowleft" size={25} color="red" />
          </TouchableOpacity>
          <Text style={[styles(colors).sheetHeaderTitle, {color: colors.text}]} numberOfLines={1}>
            {selectedSpecialOffer.name}
          </Text>
          <TouchableOpacity style={{marginLeft: "15%"}}>
            <Feather name="share" size={25} color="red" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles(colors).specialOfferSheetContent}>
          <View style={styles(colors).specialOfferDetails}>
            <Text style={[styles(colors).specialOfferName, {color: colors.text}]}>{selectedSpecialOffer.name}</Text>
            <View style={styles(colors).priceContainer}>
              <Text style={[styles(colors).specialOfferPrice, {color: colors.text}]}>
                {selectedSpecialOffer.price.toFixed(2)} €
              </Text>
              <Text style={[styles(colors).originalPrice, {color: colors.placeholder}]}>
                {originalPrice.toFixed(2)} €
              </Text>
              <View style={styles(colors).discountBadge}>
                <Text style={styles(colors).discountText}>
                  {selectedSpecialOffer.discountPercentage}% off
                </Text>
              </View>
            </View>
            <Text style={[styles(colors).specialOfferNote, {color: colors.placeholder}]}>
              * Discount applied at checkout
            </Text>
          </View>
        </ScrollView>

        <View style={[styles(colors).specialOfferBottomContainer, {backgroundColor: colors.sheetBackground}]}>
          <View style={styles(colors).quantitySelector}>
            <TouchableOpacity
              onPress={() => {
                if (quantity === 1) {
                  if (isEditing) {
                    handleRemoveItem(editingSpecialOfferItem.id);
                  }
                  if (specialOfferSheetRef.current) {
                    specialOfferSheetRef.current.close();
                  }
                } else {
                  setQuantity(Math.max(1, quantity - 1));
                }
              }}
              style={[styles(colors).quantityButton, {borderColor: colors.border}]}>
              {quantity === 1 ? (
                <MaterialIcons name="delete-outline" size={24} color={colors.text} />
              ) : (
                <Icon name="minus" size={20} color={colors.text} />
              )}
            </TouchableOpacity>
            <Text style={[styles(colors).quantityText, {color: colors.text}]}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={[styles(colors).quantityButton, {borderColor: colors.border}]}>
              <Icon name="plus" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles(colors).addToCartButton}
            onPress={() => {
              if (isEditing) {
                updateCartItem(editingSpecialOfferItem.id, {
                  ...editingSpecialOfferItem,
                  quantity: quantity
                });
              } else {
                const originalPrice = selectedSpecialOffer.price / (1 - selectedSpecialOffer.discountPercentage/100);
                addToCart({
                  id: `${selectedSpecialOffer.id}-${Date.now()}`,
                  name: selectedSpecialOffer.name,
                  basePrice: originalPrice,
                  size: '',
                  options: [],
                  optionsTotal: 0,
                  quantity: quantity,
                  discount: {
                    label: "Special Offer",
                    amount: originalPrice * (selectedSpecialOffer.discountPercentage/100),
                    percentage: selectedSpecialOffer.discountPercentage
                  },
                  originalPrice: originalPrice
                });
              }
              
              if (specialOfferSheetRef.current) {
                specialOfferSheetRef.current.close();
              }
              setEditingSpecialOfferItem(null);
            }}
          >
            <View style={{flexDirection: 'row', gap: '10%'}}>
              <Text style={styles(colors).addToCartButtonText}>
                {isEditing ? 'Update' : 'Add'}
              </Text>
              <Text style={styles(colors).addToCartButtonText}>
                {(selectedSpecialOffer.price * quantity).toFixed(2)} €
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  };

   const renderItem1 = ({item}) => {
      const isInCart = cartItems.some(cartItem => cartItem.id.startsWith(item.id));
      
      return (
        <View  style={{paddingHorizontal:3,}}>
        <TouchableOpacity 
          style={staticStyles.insideflatlist1}
          onPress={() => handleSpecialOfferPress(item)}
        >
          <Text numberOfLines={1} style={staticStyles.dish}>
            {item.name}
          </Text>
          <Text style={staticStyles.price}>{item.price.toFixed(2)} €</Text>
          <View style={{alignSelf: 'center'}}>
             <Text style={staticStyles.plusicon}><Icon name="plus" size={16} color="black" /></Text>
          </View>
        </TouchableOpacity>
        </View>
      );
    };

  const renderItem = ({item}) => {
      const isInCart = cartItems.some(cartItem => cartItem.id.startsWith(item.id));
      
      return (
        <TouchableOpacity 
          style={staticStyles.insideflatlist}
          onPress={() => handleSpecialOfferPress(item)}
        >
          <Text numberOfLines={1} style={staticStyles.dish}>
            {item.name}
          </Text>
          <Text style={staticStyles.price}>{item.price.toFixed(2)} €</Text>
          <View style={{alignSelf: 'center'}}>
             <Text style={staticStyles.plusicon}><Icon name="plus" size={17.5} color="black" /></Text>
          </View>
        </TouchableOpacity>
      );
    };
 

  const renderBreakdownItem = ({ item }) => {
    if (item.type === 'total') {
      return (
        <View style={styles(colors).paymentviewtotal}>
          <Text style={[styles(colors).titletotal, {color: colors.text}]}>{item.label}</Text>
          <Text style={[styles(colors).subtitletotal, {color: colors.text}]}>{item.value}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles(colors).paymentview}>
        <View style={styles(colors).titleContainer}>
          <Text 
            style={[
              styles(colors).title, 
              item.type === 'discount' && styles(colors).discountLabel,
             
            ]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
          {item.hasInfo && (
            <TouchableOpacity 
              style={styles(colors).iconTouchable}
              onPress={() => handleOpenInfoModal(item.infoType)}
            >
              <Feather name="info" size={18} color="grey" style={{alignItems:"center",marginTop:"6%"}}/>
            </TouchableOpacity>
          )}
        </View>
        <Text 
          style={[
            styles(colors).subtitle,
            item.type === 'discount' && styles(colors).discountValue,
            
          ]}
        >
          {item.value}
        </Text>
      </View>
    );
  };

  const openMenuItemSheet = (cartItem) => {
    if (!cartItem.originalItem) return;
    
    setSelectedMenuItem(cartItem.originalItem);
    setSelectedSize(cartItem.size);
    setQuantity(cartItem.quantity);
    setIsEditingCartItem(true);
    setEditingCartItemId(cartItem.id);
    
    const newSelectedOptions = {};
    const newSelectedOptionsSummary = [];
    
    cartItem.options.forEach(option => {
      const key = `${cartItem.size}-${option.groupIndex}-${option.key}`;
      newSelectedOptions[key] = true;
      newSelectedOptionsSummary.push(option);
    });
    
    setSelectedOptions(newSelectedOptions);
    setSelectedOptionsSummary(newSelectedOptionsSummary);
    
    if (menuItemSheetRef.current) {
      menuItemSheetRef.current.open();
    }
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
        prev.filter(item => !(item.groupIndex === groupIndex && item.key === optionKey))
      );
    }
  };

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

  const renderSizeOptions = () => {
    if (!selectedMenuItem) return null;
    const sizeData = selectedMenuItem[selectedSize];
    if (!sizeData) return null;

    return (
      <View style={styles(colors).sizeOptionsContent}>
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
            <View key={groupIndex} style={styles(colors).optionGroup}>
              <View style={styles(colors).optionGroupHeader}>
                <Text style={[styles(colors).optionGroupTitle, {color: colors.text}]}>
                  {optionGroup.topaddingdish}
                </Text>
                <Text style={[styles(colors).optionalText, {color: colors.placeholder}]}>optional</Text>
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
                    styles(colors).optionItem,
                    optionIndex !== options.length - 1 &&
                      styles(colors).optionItemBorder,
                  ]}>
                  <TouchableOpacity
                    style={[
                      styles(colors).optionCheckbox,
                      selectedOptions[
                        `${selectedSize}-${groupIndex}-${option.key}`
                      ] && styles(colors).optionCheckboxSelected,
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

                  <Text style={[styles(colors).optionName, {color: colors.text}]}>{option.name}</Text>
                  <TouchableOpacity
                 onPress={() => navigation.navigate("Infotopping")}
                    style={{marginLeft: "10%",alignContent:"flex-start",flex:1,}}>
                    <Feather
                      name="info"
                      size={20}
                      color={colors.placeholder}
                    />
                  </TouchableOpacity>
                  <Text style={[styles(colors).optionPrice, {color: colors.text}]}>{option.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  const renderMenuItemBottomSheet = () => {
    return (
      <BottomSheet
        ref={menuItemSheetRef}
        closeOnDragDown={true}
          closeOnPressBack={true}     
        closeOnPressMask={true}
        draggable={true}
        height={'75%'}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
          draggableIcon: {backgroundColor: 'lightgray'},
          container: {borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colors.sheetBackground},
        }}>
        {selectedMenuItem && (
          <>
            <View style={styles(colors).sheetHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (menuItemSheetRef.current) {
                    menuItemSheetRef.current.close();
                  }
                }}
                style={styles(colors).backButton}>
                <Icon name="arrowleft" size={25} color="red" />
              </TouchableOpacity>
              <Text style={[styles(colors).sheetHeaderTitle, {color: colors.text}]} numberOfLines={1}>
                {selectedMenuItem.dishname}
              </Text>
              <TouchableOpacity style={{marginLeft: "15%",}}>
                <Feather name="share" size={25} color="red" />
              </TouchableOpacity>
            </View>

            <ScrollView 
             ref={scrollViewRef}
              contentContainerStyle={styles(colors).menuItemSheetScrollContent}>
              <View style={styles(colors).menuItemSheetContent}>
                <Text style={[styles(colors).sheetHeaderTitle1, {color: colors.text}]} numberOfLines={1}>
                  {selectedMenuItem.dishname}
                </Text>
                <View style={styles(colors).priceContainerSheet}>
                  <Text style={[styles(colors).discountPriceSheet, {color: colors.text}]}>
                    from {selectedMenuItem.discountprice}
                  </Text>
                  <Text style={[styles(colors).originalPriceSheet, {color: colors.placeholder}]}>
                    {selectedMenuItem.originalprice}
                  </Text>
                  <View style={styles(colors).discountBadgeSheet}>
                    <Text style={styles(colors).discountTextSheet}>
                      {selectedMenuItem.discount} off *
                    </Text>
                  </View>
                </View>
                <Text style={[styles(colors).menuItemSheetDetail, {color: colors.text}]}>
                  {selectedMenuItem.dishdetail}
                </Text>
                <Text style={[styles(colors).menuItemSheetDetail1, {color: colors.placeholder}]}>
                  * Discount applied at checkout
                </Text>

                <View style={[
          styles(colors).sizeSelectionHeader, 
          selectedSize && { backgroundColor: '#4CAF50' }
      ]}>

                  <Text style={[styles(colors).sizeHeaderText, {color: colors.text}]}>Choose one</Text>
                  {selectedSize ? (
                    <Icon name="check" size={20} color={ colors.text} />
                  ) : (
                    <Text style={[styles(colors).requiredtext, {color: colors.text}]}>Required</Text>
                  )}
                </View>

                <View style={styles(colors).sizeOptionsContainer}>
                  {['Klein', 'GroB', 'Family', 'Party'].map(size => (
                    <TouchableOpacity
                      key={size}
                      style={styles(colors).sizeOption}
                      onPress={() => {
                        setSelectedOptions({});
                        setSelectedOptionsSummary([]);
                        setSelectedSize(size);
                        setTimeout(() => {
                          if (scrollViewRef.current) {
                            scrollViewRef.current.scrollTo({
                              y: height * 0.55,
                              animated: {
        duration: 10000, // Adjust this value (default is 300ms)
      },
                            });
                          }
                        }, 100);
                      }}>
                      <View style={styles(colors).sizeRadio}>
                        {selectedSize === size && (
                          <View style={styles(colors).sizeRadioInner} />
                        )}
                      </View>
                      <Text style={[styles(colors).sizeLabel, {color: colors.text}]}>{size}</Text>
                      <TouchableOpacity 
                       onPress={() => navigation.navigate("Infosize")} 
                        style={{marginRight: "5%",alignContent:"flex-start",flex:1,}}>
                        <Feather name="info" size={20} color={colors.placeholder} />
                      </TouchableOpacity>
                      <View style={styles(colors).sizePriceContainer}>
                        <Text style={[styles(colors).sizeOriginalPrice, {color: colors.placeholder}]}>
                          {selectedMenuItem[`original${size}`]}
                        </Text>
                        <Text style={[styles(colors).sizeDiscountPrice, {color: colors.text}]}>
                          {selectedMenuItem[`discount${size}`]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedSize && renderSizeOptions()}
              </View>
            </ScrollView>

            {/* Bottom fixed section */}
            <View style={[styles(colors).bottomFixedContainer, {backgroundColor: colors.sheetBackground}]}>
              {selectedSize && (
                <>
                  <View style={styles(colors).quantitySelector}>
                    <TouchableOpacity
                      onPress={() => {
                        if (quantity === 1) {
                          if (isEditingCartItem) {
                            handleRemoveItem(editingCartItemId);
                          }
                          if (menuItemSheetRef.current) {
                            menuItemSheetRef.current.close();
                          }
                        } else {
                          setQuantity(Math.max(1, quantity - 1));
                        }
                      }}
                      style={[styles(colors).quantityButton, {borderColor: colors.border}]}>
                      {quantity === 1 ? (
                        <MaterialIcons name="delete-outline" size={24} color={colors.text} />
                      ) : (
                        <Icon name="minus" size={20} color={colors.text} />
                      )}
                    </TouchableOpacity>
                    <Text style={[styles(colors).quantityText, {color: colors.text}]}>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() => setQuantity(quantity + 1)}
                      style={[styles(colors).quantityButton, {borderColor: colors.border}]}>
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
                              .trim()
                          ),
                          optionsTotal: selectedOptionsSummary.reduce(
                            (sum, opt) => 
                              sum + parseFloat(opt.price.replace('+', '').replace('€', '').replace(',', '.').trim()),
                            0
                          ),
                          originalItem: selectedMenuItem,
                        };
                        updateCartItem(editingCartItemId, updatedItem);
                      }
                      if (menuItemSheetRef.current) {
                        menuItemSheetRef.current.close();
                      }
                    }}
                    style={styles(colors).addToCartButton}>
                    <View style={{flexDirection: 'row', gap: '10%'}}>
                      <Text style={styles(colors).addToCartButtonText}>
                        Update
                      </Text>
                      <Text style={styles(colors).addToCartButtonText}>
                        {calculateTotalPrice().toFixed(2)} €
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </BottomSheet>
    );
  };

  const renderDishItem = ({item}) => {
    const isSpecialOffer = item.discount?.label === "Special Offer";
    
    return (
      <View>
        <TouchableOpacity 
          style={styles(colors).dishview}
          onPress={() => {
            if (isSpecialOffer) {
              handleEditSpecialOffer(item);
            } else {
              openMenuItemSheet(item);
            }
          }}
        >
          
            <View style={styles(colors).dishNameRow}>
              <Text style={[styles(colors).dishnametext, {color: colors.text}]}>{item.name}  <Icon name="edit" size={15} color={colors.text} /></Text>
             </View>
             <Text style={[styles(colors).pricetext, {color: colors.headerbg1}]}>
            {(item.price * item.quantity).toFixed(2)} €
          </Text>
          
        </TouchableOpacity>
         <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:"2%",gap:"50%"}}>
                            <View style={styles(colors).discountTag}>
                               <Icon name="tag" size={12} color="black" style={styles(colors).tagIcon} />
                               <Text style={styles(colors).discountText}>
                                 Special offer
                               </Text>
                               </View>
                              <Text style={[styles(colors).pricetext1, {color: colors.headerbg1}]}>
                         - {(((item.price * item.quantity).toFixed(2))*.12).toFixed(2)} €
                       </Text>
                       </View>
         <Text style={{fontSize:14,marginTop:"2%",color: colors.text,fontWeight:"500"}}>{item.size}</Text>
        {item.details.length > 0 && (
          <View style={styles(colors).detailview}>
            {item.details.map((detail, index) => (
              <Text key={index} style={[styles(colors).detailtext, {color: colors.headerbg1}]}>
                + {detail}{''}
              </Text>
             
            ))}
            
          </View>
        )}
        <View style={styles(colors).notecounterview}>
          <TouchableOpacity 
            style={[styles(colors).notetouchable, {borderColor: colors.border}]}   
            onPress={() => handleOpenNoteSheet(item.id)} 
          >
            <Icon1 name="document-text-outline" size={17} color={colors.text} />
            <Text style={[styles(colors).addtext, {color: colors.text}]}>
              {item.note ? 'Edit note' : 'Add note'}
            </Text>
          </TouchableOpacity>
          <View style={styles(colors).counter}>
            <TouchableOpacity
              onPress={() => {
                if (item.quantity === 1) {
                  handleRemoveItem(item.id);
                } else {
                  dispatch({ type: ACTIONS.DECREMENT, payload: item.id });
                  updateQuantity(item.id, item.quantity - 1);
                }
              }}
            >
              {item.quantity === 1 ? (
                <MaterialIcons name="delete-outline" size={26} color={colors.text} />
              ) : (
                <Icon name="minus" size={25} color={colors.text} />
              )}
            </TouchableOpacity>
            <Text style={[styles(colors).countertext, {color: colors.text}]}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                dispatch({ type: ACTIONS.INCREMENT, payload: item.id });
                updateQuantity(item.id, item.quantity + 1);
              }}
            >
              <Icon name="plus" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderBottomSheetContent = () => (
    <View style={[styles(colors).bottomSheetContainer, {backgroundColor: colors.card}]}>
      <Text style={[styles(colors).bottomSheetTitle, {color: colors.text}]}>Add a note</Text>
      <Text style={[styles(colors).bottomSheetSubtitle, {color: colors.text}]}>
        Please do not include details about any allergies or dietary preferences in the note.
      </Text>
      
      <TextInput
        style={[styles(colors).noteInput, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
        multiline
        maxLength={180}
        placeholder="Write your note here..."
        placeholderTextColor={colors.placeholder}
        value={noteText}
        onChangeText={setNoteText}
      />
      
      <Text style={[styles(colors).charCount, {color: colors.text}]}>{180 - noteText.length} characters remaining</Text>
      
      <View style={styles(colors).bottomSheetButtons}>
        <TouchableOpacity
          style={[styles(colors).cancelButton, {borderColor: colors.border}]}
          onPress={() => {
            if (bottomSheetRef.current) {
              bottomSheetRef.current.close();
            }
          }}
        >
          <Text style={[styles(colors).cancelButtonText, {color: colors.text}]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles(colors).addButton}
          onPress={handleSaveNote}
        >
          <Text style={styles(colors).addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const breakdownData = buildBreakdownData();

  return (
    <View style={{paddingTop: insets.top,paddingBottom:insets.bottom+5,flex:1, backgroundColor: colors.background}}>
      
      <View style={[styles(colors).personalview, {backgroundColor: colors.headerBg}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles(colors).arrowtouchable}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles(colors).ordertext}>Your order</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles(colors).scrollview, {backgroundColor: colors.background}]}>
        <View style={styles(colors).deliveryOptionsContainer}>
          <View style={[styles(colors).deliveryOptions, {backgroundColor: colors.tabBg}]}>
            <TouchableOpacity
              style={[
                selectedOption === 'delivery'
                  ? [styles(colors).deliveryButton, {backgroundColor: colors.border1}]
                  : [styles(colors).collectionButton, {backgroundColor: colors.tabBg}],
              ]}
              onPress={() => setSelectedOption('delivery')}>
              <FontAwesome name="motorcycle" size={24} color="#f41909" />
              <View>
                <Text style={[styles(colors).deliveryText, {color: colors.text}]}> Delivery</Text>
                <Text style={[styles(colors).deliveryTime, {color: colors.text}]}>30-55 mins</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                selectedOption === 'pickup'
                  ? [styles(colors).deliveryButton, {backgroundColor: colors.border1}]
                  : [styles(colors).collectionButton, {backgroundColor: colors.tabBg}],
              ]}
              onPress={() => setSelectedOption('pickup')}>
              <FontAwesome name="shopping-bag" size={24} color="#f41909" />
              <View>
                <Text style={[styles(colors).deliveryText, {color: colors.text}]}> Pick Up</Text>
                <Text style={[styles(colors).deliveryTime, {color: colors.text}]}>15 mins</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles(colors).addMoreContainer}>
          <TouchableOpacity 
            style={styles(colors).addMoreButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="plus" size={18} color="red" />
            <Text style={styles(colors).addMoreText}>Add more Items</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles(colors).greyLine, {backgroundColor: colors.border}]} />

        {dishes.length === 0 ? (
          <View>
            <Text style={{alignSelf:"center",marginTop:"5%"}}>  <FontAwesome6 name="basket-shopping" size={35} color={colors.placeholder} /></Text>
          <Text style={[styles(colors).emptyText, {color: colors.text}]}>Your cart is empty</Text>
          <TouchableOpacity   onPress={() => navigation.goBack()} ><Text style={{alignSelf:"center",fontWeight:"bold",fontSize:17,marginTop:"5%", color: colors.text}}>Go Back</Text></TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={dishes}
              renderItem={renderDishItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={[styles(colors).lineview, {backgroundColor: colors.border}]} />}
            />
            <View style={[styles(colors).lineview, ]} />
            
            {/* Special Offer Banner */}
            {isSpecialOfferEligible && (
              <View style={styles(colors).specialOfferBanner}>
                <Icon name="gift" size={22} color="white" />
                <Text numberOfLines={2} style={styles(colors).specialOfferText}>
                  Special Offer Applied! on your order
                </Text>
              </View>
            )}
            
            {/* EXCLUDED FROM DARK THEME - REMAINS ORIGINAL STYLE */}
            <View style={staticStyles.seenyouview}>
              <Text style={staticStyles.havetext}>Have you seen...</Text>
              <FlatList
                data={specialOffers}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
              <FlatList 
                horizontal
                style={{marginHorizontal:-10,elevation:10}}
                data={specialOffers1}
                renderItem={renderItem1}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={true}
              />
            </View>

            <FlatList
              style={{marginTop: 20, marginBottom: 2}}
              data={breakdownData}
              renderItem={renderBreakdownItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    
      {dishes.length > 0 && (
        <View style={[styles(colors).checkoutview, {backgroundColor: colors.card}]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Checkout')}
            style={styles(colors).checkouttouchable}
          >
            <Text style={styles(colors).checkouttext}>Go to checkout</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <BottomSheet
        ref={bottomSheetRef}
        height={500}
        draggable={true}
          closeOnPressBack={true}     
        closeOnDragDown={true}
        closeOnPressMask={true}
        duration={250}
        customStyles={{
          container: [styles(colors).bottomSheetContainerStyle, {backgroundColor: colors.card}],
          wrapper: styles(colors).bottomSheetWrapperStyle,
          draggableIcon: {
            backgroundColor: 'lightgray',
          },
        }}
      >
        {renderBottomSheetContent()}
      </BottomSheet>
      
      {/* Info Modal Bottom Sheet */}
      <BottomSheet
        ref={infoBottomSheetRef}
        height={400}
        draggable={true}
        closeOnDragDown={true}
          closeOnPressBack={true}     
        closeOnPressMask={true}
        duration={250}
        customStyles={{
          container: [styles(colors).infoBottomSheetContainer, {backgroundColor: colors.card}],
          wrapper: styles(colors).bottomSheetWrapperStyle,
          draggableIcon: {
            backgroundColor: 'lightgray',
          },
        }}
      >
        <ScrollView contentContainerStyle={styles(colors).modalScrollContent}>
          {renderInfoModalContent()}
        </ScrollView>
      </BottomSheet>
      
      {/* Menu Item Bottom Sheet */}
      {renderMenuItemBottomSheet()}
      
      {/* Special Offer Bottom Sheet */}
      {renderSpecialOfferBottomSheet()}
    </View>
  );
};

// Static styles for the excluded section (remains unchanged)
const staticStyles = StyleSheet.create({
  seenyouview: {
    backgroundColor: 'orange',
    paddingHorizontal: 15,
    paddingVertical: "5%",
    borderRadius: 15,
    marginTop: 30,
  },
  havetext: {fontSize: moderateScale(17), fontWeight: 'bold', fontFamily: 'poppins-Medium'},
  insideflatlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginVertical: 10,
    paddingVertical: 11,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 15,
  },
  insideflatlist1: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 12,
    paddingHorizontal:5,
  },
  dish: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: 'poppins-Medium',
    fontWeight: 'bold',
    marginRight: 0,
    overflow: 'hidden',
    top: 2,
  },
  price: {
    width: 65,
    textAlign: 'right',
    fontSize: moderateScale(14),
    fontFamily: 'poppins-Medium',
    fontWeight: 'bold',
    marginRight: 10,
    top: 3,
  },
  plusicon: {
    backgroundColor: '#E3E4E0',
    borderRadius: 50,
    alignSelf: 'center',
    padding: 5,
  },
});

// Dynamic styles for the rest of the component
const styles = (colors) => StyleSheet.create({
  personalview: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 5,
  },
  arrowtouchable: {left: 10},
  ordertext: {
    marginLeft:"30%",
    color: 'white',
    fontFamily: 'poppin-Medium',
    fontWeight: 'bold',
    fontSize: moderateScale(21),
  },
  scrollview: {marginHorizontal: 15,flex:1},
  dishnametext: {
    fontSize: moderateScale(16),
    fontFamily: 'poppins-Medium',
    fontWeight: 'bold',
  },
  pricetext: {fontSize: moderateScale(16), fontFamily: 'poppins-Regular',},
  pricetext1: {
    fontSize: moderateScale(15),
    fontFamily: 'poppins-Regular',
    
  },
  dishview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dishNameRow: {
    alignItems:"flex-start"
  },
  discountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagIcon: {
    marginRight: 4,
  },
  discountText: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: 'black',
  },
  detailview: {marginTop: 0},
  detailtext: {},
  notetouchable: {
    flexDirection: 'row',
    borderWidth: 1,
    alignSelf: 'center',
    paddingVertical: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  addtext: {marginLeft: 2, fontFamily: 'poppins-Regular', fontWeight: '700',fontSize:13},
  counter: {
    alignItems:'center',
    flexDirection: 'row',
    backgroundColor: colors.cartItemBg,
    alignSelf: 'center',
    paddingVertical: 6,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  countertext: {paddingHorizontal: 8, fontSize: moderateScale(17), fontWeight: 'bold'},
  notecounterview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  plusicon: {
    backgroundColor: '#E3E4E0',
    borderRadius: 50,
    alignSelf: 'center',
    padding: 5,
  },
  paymentviewtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  titletotal: {fontSize: moderateScale(18), fontWeight: 'bold'},
  subtitletotal: {fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: 20},
  paymentview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: moderateScale(15),
    flexShrink: 1,
    color: colors.headerbg1
  },
  discountLabel: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: moderateScale(16),
    marginLeft: 'auto',
    color: colors.headerbg1
  },
  discountValue: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  iconTouchable: {
    marginLeft: "1.5%",
  },
  deliveryOptionsContainer: {
    paddingTop: 15,
  },
  deliveryOptions: {
    flexDirection: 'row',
    borderRadius: 35,
    alignSelf: 'center',
  },
  deliveryButton: {
    borderRadius: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {fontWeight: 'bold'},
  deliveryTime: {fontSize: moderateScale(12)},
  collectionButton: {
    padding: 4,
    borderRadius: 30,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  lineview: {
    borderBottomWidth: 1,
    marginTop: 10,
    borderColor:"lightgrey"
  },
  checkouttouchable: {
    marginHorizontal: 20,
    marginTop:"2.5%",
  },
  checkouttext: {
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'red',
    paddingVertical: 8,
    borderRadius: 20,
  },
  checkoutview: {},
  bottomSheetContainer: {
    backgroundColor: colors.card,
    padding: 20,
  },
  bottomSheetContainerStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
  },
  bottomSheetWrapperStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bottomSheetSubtitle: {
    marginBottom: 10,
    fontSize: 14,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 10,
    fontSize: 16,
  },
  charCount: {
    textAlign: 'right',
    marginBottom: 20,
    fontSize: 14,
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  addMoreText: {
    marginLeft: 10,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: 'red',
  },
  greyLine: {
    height: 1,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontWeight:"500"
  },
  specialOfferBanner: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  specialOfferText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: moderateScale(13),
  },
  // Info Modal Styles
  infoBottomSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalContent: {
    flex: 1,
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cartItemBg,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  feeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  feeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#f41909',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Menu Item Bottom Sheet Styles
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
    backgroundColor: 'black',
    color: 'white',
    padding: 2,
    borderRadius: 5,
  },
  menuItemSheetScrollContent: {
    paddingBottom: 130,
  },
  menuItemSheetContent: {
    paddingHorizontal: 15,
    marginTop: 0,
    marginBottom: 50,
  },
  sheetHeaderTitle1: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    flex: 1,
    alignSelf: 'center',
    marginTop: '2.5%',
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
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  sizePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeOriginalPrice: {
    fontSize: moderateScale(15),
    textDecorationLine: 'line-through',
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
  },
  optionalText: {
    fontSize: moderateScale(14),
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
    marginLeft: 10,
  },
  sizeOptionsContent: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  sizeSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cartItemBg,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  bottomFixedContainer: {
    position: 'absolute',
    bottom: '8.5%',
    left: 0,
    right: 0,
    backgroundColor: colors.sheetBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  menuItemSheetDetail: {
    fontSize: moderateScale(15),
    marginBottom: 10,
    alignSelf: 'center',
  },
  menuItemSheetDetail1: {
    fontSize: moderateScale(14),
    marginBottom: 20,
    alignSelf: 'center',
  },
  // Special Offer Bottom Sheet Styles
  specialOfferSheetContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  specialOfferDetails: {
    alignItems: 'center',
    marginTop: 20,
  },
  specialOfferName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  specialOfferPrice: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: 'red',
  },
  originalPrice: {
    fontSize: moderateScale(16),
    textDecorationLine: 'line-through',
    marginHorizontal: 10,
  },
  discountBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
 
  specialOfferNote: {
    fontSize: moderateScale(14),
    fontStyle: 'italic',
    marginBottom: "15%",
  },
  specialOfferBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.sheetBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 1,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});

export default Cart;