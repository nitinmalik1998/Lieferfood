import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon6 from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import { useTheme } from '../State/ThemeContext';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);

const Account = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const { theme, toggleTheme, getColors } = useTheme();
  const colors = getColors();

  // Default country if none is selected
  const defaultCountry = { 
    id: 1, 
    imageofcountry: 'https://flagcdn.com/w80/de.png', 
    countryname: 'Country' 
  };

  // Get selected country from navigation params or use default
  const selectedCountry = route.params?.selectedCountry || defaultCountry;

  const handleEditCountry = () => {
    navigation.navigate('Country', { currentCountry: selectedCountry });
  };

  const handleThemeSelect = (selectedTheme) => {
    toggleTheme(selectedTheme);
    setThemeModalVisible(false);
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background,paddingTop: insets.top,  }]}>
      <ScrollView style={{ flex: 1}}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={[styles.closeButton, { alignItems:"flex-end",marginRight:"5%"}]}>
          <Icon name="close" size={30} color={colors.icon} />
        </TouchableOpacity>
        <View style={styles.profileview}>
          <Text style={[styles.profiletext, { color: colors.text }]}>Hey, Axar Verma!</Text>
          <Image
            source={{
              uri: 'https://th.bing.com/th/id/R.46c9bf15f97b3d9ac756ffcded16140d?rik=PY0r%2fu4ePFDw3w&riu=http%3a%2f%2fstatics.sportskeeda.com%2fwp-content%2fuploads%2f2013%2f03%2f110406770-1362486107.jpg&ehk=yD9%2bdr4Il5vFkMq%2fvbUGX7NFHU9FmBZWSonj%2bPQCcvA%3d&risl=&pid=ImgRaw&r=0',
            }}
            style={{height: 50, width: 45, borderRadius: 50}} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Personalinformation')}>
          <Text
            style={{
              marginHorizontal: 20,
              fontsize: moderateScale(20),
              color: 'red',
              fontweight: 'bold',
            }}>
            View Personal information
          </Text>
        </TouchableOpacity>
        <View style={{marginTop: 20,marginBottom:15,}}>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')} >
            <View
              style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
              <Text>
                <Icon name="bag-handle-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Orders</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favourites')} >
            <View
              style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
              <Text>
                <Icon name="heart-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Favourites</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Address')} >
            <View
              style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
              <Text>
                <Icon name="home-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Addresses</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.lineview, { borderColor: colors.border }]}></View>

          {/* Language Option */}
          <TouchableOpacity onPress={() => navigation.navigate('Language')}>
            <View style={{flexDirection: 'row', marginTop: 25, marginHorizontal: 20}}>
              <Text>
                <Icon name="language-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Language</Text>
            </View>
          </TouchableOpacity>

          {/* Country Option */}
          <TouchableOpacity onPress={handleEditCountry}>
            <View style={{flexDirection: 'row', marginTop: 25, marginHorizontal: 20}}>
              <Image
                source={{uri: selectedCountry.imageofcountry}}
                style={{width: 30, height: 30, borderRadius: 20, alignSelf: 'center'}}
              />
              <Text style={[styles.subtitletext, { color: colors.text }]}>{selectedCountry.countryname}</Text>
            </View>
          </TouchableOpacity>

          {/* App Theme Option */}
          <TouchableOpacity onPress={() => setThemeModalVisible(true)}>
            <View style={{flexDirection: 'row', marginTop: 25, marginHorizontal: 20}}>
              <Text>
                <Icon name="contrast-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>App theme</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={{flexDirection: 'row', marginTop: 25, marginHorizontal: 20}}>
              <Text>
                <Icon1 name="add-card" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>StampCards</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{flexDirection: 'row', marginTop: 25, marginHorizontal: 20}}>
              <Text>
                <Icon6 name="exclamationcircleo" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Need help?</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 25,
                marginHorizontal: 20,
              }}>
              <Text>
                <Icon2 name="file-star-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Gift Cards</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.lineview, { borderColor: colors.border }]}></View>

          <TouchableOpacity>
            <View
              style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
              <Text>
                <Icon2 name="bike-fast" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Become a courier</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
              <Text>
                <Icon2 name="office-building-outline" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Lieferfood for business</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.lineview, { borderColor: colors.border }]}></View>
          <TouchableOpacity>
            <View
              style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20,marginBottom:3}}>
              <Text>
                <Icon6 name="logout" size={30} color="red" />
              </Text>
              <Text style={[styles.subtitletext, { color: colors.text }]}>Log out</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.lineview, { borderColor: colors.border }]}></View>
        </View>
      </ScrollView>

      {/* Theme Selection Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose an app theme</Text>
          </View>
          
          {/* Light Theme Option */}
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => handleThemeSelect('LIGHT')}
          >
            <Icon name="sunny-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.themeText, { color: colors.text }]}>LIGHT</Text>
            {theme === 'LIGHT' && (
              <Icon name="checkmark" size={24} color="#FF6B6B" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
          
          {/* Dark Theme Option */}
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => handleThemeSelect('DARK')}
          >
            <Icon name="moon-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.themeText, { color: colors.text }]}>DARK</Text>
            {theme === 'DARK' && (
              <Icon name="checkmark" size={28} color="#FF6B6B" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginHorizontal: 20,
  },
  profiletext: {
    fontFamily: 'poppins-Medium', 
    fontWeight: '700', 
    fontSize: moderateScale(22),
    color: colors.text,
  },
  subtitletext: {
    marginTop: 2.5,
    left: 20,
    fontSize: moderateScale(16),
    fontFamily: 'poppins-Regular',
    fontWeight: '700',
    color: colors.text,
  },
  lineview: {
    borderBottomWidth: 1,
    marginTop: 15,
    marginHorizontal: -20,
    
  },
  closeButton: {
  
  },
  // Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    fontFamily: 'poppins-Regular',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  themeText: {
    marginLeft: 15,
    fontSize: moderateScale(16),
    fontFamily: 'poppins-Regular',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
});

export default Account;