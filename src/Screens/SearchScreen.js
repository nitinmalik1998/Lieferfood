// SearchScreen.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../State/CartContext';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { startSpeechToText } from 'react-native-voice-to-text';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { cartItems, addToCart, removeFromCart, updateCartItem, totalItemsCount, calculateCartTotal } = useCart();
  const { menulist } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [expandedOptions, setExpandedOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionsSummary, setSelectedOptionsSummary] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isEditingCartItem, setIsEditingCartItem] = useState(false);
  const [editingCartItemId, setEditingCartItemId] = useState(null);

  const { getColors } = useTheme();
  const colors = getColors();
  
  const styles = useMemo(() => createStyles(colors), [colors]);

  const menuItemSheetRef = useRef(null);
  const scrollViewRef = useRef();
  const voiceRecognitionActive = useRef(false);

  // Menu items processing
  const allMenuItems = menulist.flatMap(section =>
    section.data.map(item => ({ ...item, sectionTitle: section.title })),
  );
  const allItems = [...allMenuItems];

  useEffect(() => {
    if (searchQuery) {
      const filtered = allItems.filter(
        item =>
          item.dishname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);

  // Voice recognition functionality
  const startVoiceRecognition = async () => {
    setIsListening(true);
    voiceRecognitionActive.current = true;

    try {
      const result = await startSpeechToText();
      if (voiceRecognitionActive.current) {
        setSearchQuery(result);
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
    } finally {
      setIsListening(false);
      voiceRecognitionActive.current = false;
    }
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
    voiceRecognitionActive.current = false;
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

      // Pre-select options
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

  // Reset toppings when size changes
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setSelectedOptions({});
    setSelectedOptionsSummary([]);
    setExpandedOptions(true);

    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: height * 0.66,
          animated: true,
        });
      }
    }, 100);
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

    setSelectedOptions(prev => ({ ...prev, [uniqueKey]: isSelected }));

    if (isSelected) {
      setSelectedOptionsSummary(prev => [
        ...prev,
        { name: optionName, price: optionPrice, groupIndex, key: optionKey },
      ]);
    } else {
      setSelectedOptionsSummary(prev =>
        prev.filter(item => !(item.groupIndex === groupIndex && item.key === optionKey))
      );
    }
  };

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

    // Helper to generate signature for cart item comparison
    const getCartItemSignature = (item) => {
      return `${item.name}|${item.size}|${JSON.stringify(item.options.map(opt => opt.key).sort())}`;
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
                  <Text style={[styles.optionGroupTitle, { color: colors.text }]}>
                    {optionGroup.topaddingdish}
                  </Text>
                  <Text style={[styles.optionalText, { color: colors.placeholder }]}>optional</Text>
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
                    ]}
                  >
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
                      }
                    >
                      {selectedOptions[
                        `${selectedSize}-${groupIndex}-${option.key}`
                      ] && <Icon name="check" size={16} color="white" />}
                    </TouchableOpacity>

                    <Text style={[styles.optionName, { color: colors.text }]}>{option.name}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Infotopping")}
                      style={{ marginLeft: "10%", alignContent: "flex-start", flex: 1, }}
                    >
                      <Feather
                        name="info"
                        size={20}
                        color={colors.icon}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.optionPrice, { color: colors.text }]}>{option.price}</Text>
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
        onClose={() => {
          // Reset state when sheet is closed
          setSelectedSize(null);
          setSelectedOptions({});
          setSelectedOptionsSummary([]);
          setExpandedOptions(false);
          setQuantity(1);
          setIsEditingCartItem(false);
          setEditingCartItemId(null);
        }}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          draggableIcon: { backgroundColor: colors.border },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.sheetBackground,
          },
        }}
      >
        {selectedMenuItem && (
          <>
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                onPress={() => menuItemSheetRef.current.close()}
                style={styles.backButton}
              >
                <Icon name="arrowleft" size={25} color="red" />
              </TouchableOpacity>
              <Text style={[styles.sheetHeaderTitle, { color: colors.text }]} numberOfLines={1}>
                {selectedMenuItem.dishname}
              </Text>
              <TouchableOpacity style={{ marginLeft: "15%", }}>
                <Feather name="share" size={25} color="red" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.menuItemSheetScrollContent}
            >
              <View style={styles.menuItemSheetContent}>
                <Text style={[styles.sheetHeaderTitle1, { color: colors.text }]} numberOfLines={1}>
                  {selectedMenuItem.dishname}
                </Text>
                <View style={styles.priceContainerSheet}>
                  <Text style={[styles.discountPriceSheet, { color: colors.text }]}>
                    from {selectedMenuItem.discountprice}
                  </Text>
                  <Text style={[styles.originalPriceSheet, { color: colors.placeholder }]}>
                    {selectedMenuItem.originalprice}
                  </Text>
                  <View style={[styles.discountBadgeSheet, { backgroundColor: colors.badgeBackground }]}>
                    <Text style={[styles.discountTextSheet, { color: colors.text }]}>
                      {selectedMenuItem.discount} off *
                    </Text>
                  </View>
                </View>
                <Text style={[styles.menuItemSheetDetail, { color: colors.text }]}>
                  {selectedMenuItem.dishdetail}
                </Text>
                <Text style={[styles.menuItemSheetDetail1, { color: colors.placeholder }]}>
                  * Discount applied at checkout
                </Text>

                <View style={[
                  styles.sizeSelectionHeader,
                  selectedSize && { backgroundColor: colors.selectedSizeHeader }
                ]}>
                  <Text style={[styles.sizeHeaderText, selectedSize && { color: 'white' }]}>
                    Choose one
                  </Text>
                  {selectedSize ? (
                    <Icon name="check" size={20} color="white" />
                  ) : (
                    <Text style={[styles.requiredtext, {
                      backgroundColor: colors.requiredBadgeBackground,
                      color: colors.requiredBadgeText
                    }]}>
                      Required
                    </Text>
                  )}
                </View>

                <View style={styles.sizeOptionsContainer}>
                  {['Klein', 'GroB', 'Family', 'Party'].map(size => (
                    <TouchableOpacity
                      key={size}
                      style={styles.sizeOption}
                      onPress={() => handleSizeChange(size)}
                    >
                      <View style={styles.sizeRadio}>
                        {selectedSize === size && (
                          <View style={styles.sizeRadioInner} />
                        )}
                      </View>
                      <Text style={[styles.sizeLabel, { color: colors.text }]}>{size}</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Infosize")}
                        style={{ marginRight: "5%", alignContent: "flex-start", flex: 1, }}
                      >
                        <Feather name="info" size={20} color={colors.icon} />
                      </TouchableOpacity>
                      <View style={styles.sizePriceContainer}>
                        <Text style={[styles.sizeOriginalPrice, { color: colors.placeholder }]}>
                          {selectedMenuItem[`original${size}`]}
                        </Text>
                        <Text style={[styles.sizeDiscountPrice, { color: colors.text }]}>
                          {selectedMenuItem[`discount${size}`]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Show toppings when expandedOptions is true */}
                {expandedOptions && renderSizeOptions()}
              </View>
            </ScrollView>

            {/* Bottom fixed section */}
            <View style={[styles.bottomFixedContainer, { borderTopColor: colors.border }]}>
              {selectedSize && (
                <>
                  <View style={styles.quantitySelector}>
                    {/* DELETE BUTTON WHEN QUANTITY IS 1 */}
                    {quantity === 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          if (isEditingCartItem) {
                            removeFromCart(editingCartItemId);
                          }
                          menuItemSheetRef.current.close();
                        }}
                        style={styles.quantityButton}
                      >
                        <Icon4 name="delete-outline" size={24} color={colors.text} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setQuantity(quantity - 1)}
                        style={styles.quantityButton}
                      >
                        <Icon name="minus" size={20} color={colors.text} />
                      </TouchableOpacity>
                    )}

                    <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>

                    <TouchableOpacity
                      onPress={() => setQuantity(quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Icon name="plus" size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (isEditingCartItem) {
                        // Update existing cart item
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
                      } else {
                        // Add new item to cart - check if identical item exists
                        const newItemSignature = `${selectedMenuItem.dishname}|${selectedSize}|${JSON.stringify(selectedOptionsSummary.map(opt => opt.key).sort())}`;

                        // Find existing item with same signature
                        const existingItem = cartItems.find(item =>
                          `${item.name}|${item.size}|${JSON.stringify(item.options.map(opt => opt.key).sort())}` === newItemSignature
                        );

                        if (existingItem) {
                          // Update quantity of existing item
                          updateCartItem(existingItem.id, {
                            ...existingItem,
                            quantity: existingItem.quantity + quantity
                          });
                        } else {
                          // Add new item to cart
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
                    style={styles.addToCartButton}
                  >
                    <View style={{ flexDirection: 'row', gap: '6%', }}>
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

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 15,
        paddingBottom: cartItems.length > 0 ? insets.bottom + 10 : insets.bottom,
        paddingTop: insets.top + 5,
        backgroundColor: colors.background,
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={28} color="red" />
        </TouchableOpacity>

        <View style={[styles.searchContainer, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for an item..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          <TouchableOpacity
            onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
            style={styles.voiceButton}
          >
            {isListening ? (
              <Icon name="close" size={22} color="red" />
            ) : (
              <Icon1 name="microphone" size={22} color="red" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.divider, ]} />

      {isListening && (
        <View style={[styles.listeningContainer, { backgroundColor: colors.listeningBg }]}>
          <View style={styles.listeningIndicator}>
            <View style={[styles.soundWave, styles.soundWave1]} />
            <View style={[styles.soundWave, styles.soundWave2]} />
            <View style={[styles.soundWave, styles.soundWave3]} />
          </View>
          <Text style={[styles.listeningText, { color: colors.text }]}>Listening... Speak now</Text>
        </View>
      )}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => openMenuItemSheet(item)}>
              <View style={styles.menuItem}>
                <View style={styles.itemLeft}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{item.sectionTitle}</Text>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.dishName, { color: colors.text }]}>{item.dishname}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.discountPrice, { color: colors.text }]}>
                      from {item.discountprice}
                    </Text>
                    <Text style={[styles.originalPrice, { color: colors.placeholder }]}>{item.originalprice}</Text>
                  </View>
                  <Text style={[styles.dishDetail, { color: colors.placeholder }]}>{item.dishdetail}</Text>
                  <View style={styles.plusdiscountview}>
                    <Text style={styles.offericon}>
                      <Icon4 name="local-offer" size={16} color={colors.black} />
                    </Text>
                    <Text style={[styles.discounttext, { color: colors.text }]}>{item.discount} off</Text>
                  </View>
                </View>

                <View style={styles.itemRight}>
                  <TouchableOpacity
                    style={[styles.plusButton, { borderColor: colors.border }]}
                    onPress={() => openMenuItemSheet(item)}
                  >
                    <Icon name="plus" size={17} color="red" />
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
                  style={[styles.cartItemContainer, { paddingBottom:8,}]}
                >
                  <View style={[styles.cartItemRow, { backgroundColor: colors.itembackground }]}>
                  <Text style={styles.cartItemText}>
                                    <Text style={{fontWeight:"bold",fontSize:15,color:"grey"}}>{cartItem.size}</Text>{'\n'}
                                       {cartItem.options.map(opt => opt.name).join(', ')}
                                     </Text>
                    <Text style={[styles.cartItemPrice, { color: colors.text }]}>
                      {((cartItem.basePrice + cartItem.optionsTotal) * cartItem.quantity).toFixed(2)} €
                    </Text>
                    <View style={{ marginLeft: 15, justifyContent: 'center', }}>
                      <Text style={[styles.cartItemPrice1, { backgroundColor: colors.badgeBackground, color: colors.badgeText }]}> {cartItem.quantity} </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {searchQuery ? 'No results found' : 'Search for an item...'}
          </Text>
        }
      />

      {/* Cart Summary Bar */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={[styles.cartSummaryContainer, { backgroundColor: colors.cartSummaryBg }]}
          onPress={() => navigation.navigate('Cart')}
        >
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

      {renderMenuItemBottomSheet()}
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 10,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 10,
    paddingRight: 10,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16.5,
    color: colors.text,
  },
  voiceButton: {
    padding: 5,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: colors.text,
  },
  listeningContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: colors.listeningBg,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  soundWave: {
    width: 4,
    backgroundColor: 'red',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  soundWave1: {
    height: 20,
    animationKeyframes: [
      { 0: { height: 10 }, 
        50: { height: 25 }, 
        100: { height: 10 } }
    ],
    animationDuration: '1000ms',
  },
  soundWave2: {
    height: 30,
    animationKeyframes: [
      { 0: { height: 15 }, 
        50: { height: 35 }, 
        100: { height: 15 } }
    ],
    animationDuration: '800ms',
  },
  soundWave3: {
    height: 20,
    animationKeyframes: [
      { 0: { height: 10 }, 
        50: { height: 25 }, 
        100: { height: 10 } }
    ],
    animationDuration: '1200ms',
  },
  listeningText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.text,
  },

  menuItemSheetContent: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  menuItemSheetTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: colors.text,
  },
  menuItemSheetDetail: {
    fontSize: moderateScale(15),
    color: colors.text,
    marginBottom: 20,
    alignSelf: 'center',
  },
  menuItemSheetDetail1: {
    fontSize: moderateScale(14),
    color: colors.placeholder,
    marginBottom: 20,
    alignSelf: 'center',
  },
  priceContainerSheet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 10,
    alignSelf: 'center',
  },
  discountPriceSheet: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.text,
  },
  originalPriceSheet: {
    fontSize: moderateScale(17),
    textDecorationLine: 'line-through',
    color: colors.placeholder,
  },
  discountBadgeSheet: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: colors.badgeBackground,
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
    alignItems: "center",
    marginBottom: "6%"
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


  addToCartButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 30,

  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(17),
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
    fontSize: moderateScale(16),
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
    color: colors.placeholder,
    marginRight: 8,
  },
  sizeDiscountPrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.text,
  },

  sizeOptionsContent: {
    marginTop: 15,
    paddingHorizontal: 10
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
    borderColor: 'red',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
  },
  sizeSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.choosebackground,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  requiredtext: {
    fontWeight: '500',
    padding: 2,
    borderRadius: 5,
  },
  optionGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  optionGroupTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.text,
  },
  optionalText: {
    fontSize: moderateScale(14),
    color: colors.placeholder,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: 15,
    borderBottomWidth: 0,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  itemLeft: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  titleName: {
    fontSize: 12.5,
    fontWeight: '400',
    color: colors.text
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: colors.text,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: colors.placeholder,
  },
  dishDetail: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 5,
  },
  plusdiscountview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offericon: {
    marginRight: 5,
    backgroundColor: colors.badgeBackground,
    padding: 2,
    borderRadius: 30,
  },
  discounttext: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  itemRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 12.7,
    fontWeight: "400",
    color: colors.text
  },

  divider: {
    borderBottomWidth: 0.3,
    marginHorizontal: -20,
    borderColor:"lightgrey"
  },

  menuItemSheetScrollContent: {
    paddingBottom: 160,
  },
  bottomFixedContainer: {
    position: 'absolute',
    bottom: '9%',
    left: 0,
    right: 0,
    backgroundColor: colors.sheetBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderTopWidth: 1,
  },

  quantityButtonText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.text,
  },
  quantityText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
    color: colors.text,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    marginRight: 15,
  },
  sheetHeaderTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    flex: 1,
    color: colors.text,
  },
  sheetHeaderTitle1: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    flex: 1,
    alignSelf: 'center',
    color: colors.text,
  },

  // New cart styles
  cartItemContainer: {
    borderRadius: 8,
    padding: 5,
    marginVertical:2,
    borderColor: colors.divider,
    paddingBottom: "0%",
    borderBottomWidth:1.5,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
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
    alignSelf: "center",
    color: colors.text,
  },
  cartItemPrice1: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    borderRadius: 5,
    padding: 3,
    backgroundColor: colors.badgeBackground,
    color: colors.badgeText,
  },
  // Cart summary bar styles
  cartSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: "5%",
    backgroundColor: colors.cartSummaryBg,
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
    top: "-70%",
    right: "50%"
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
});

export default SearchScreen;