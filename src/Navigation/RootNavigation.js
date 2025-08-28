import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../Screens/Home';
import {NavigationContainer} from '@react-navigation/native';
import AboutRestaurant from '../Screens/AboutRestaurant';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import SearchResto from '../Screens/SearchResto';
import Filter from '../Screens/Filter';
import SearchLocation from '../Screens/SearchLocation';
import TabNavigation from './TabNavigation';
import Personalinformation from '../Screens/Personalinformation';
import Address from '../Screens/Addresses';
import Favourites from '../Screens/Favourites';
import Orders from '../Screens/Orders';
import Seeall from '../Screens/Seeall';
import Account from '../Screens/Account';
import Checkout from '../Screens/Checkout';
import Paymentmethod from '../Screens/Paymentmethod';
import Splash from '../Screens/Splash';
import Aboutus from '../Screens/Aboutus';
import Reviews from '../Screens/Reviews';
import Cart from '../Screens/Cart';
import Help from '../Screens/Help';
import SearchScreen from '../Screens/SearchScreen';
import Finalpage from '../Screens/Finalpage';
import Pricereceipt from '../Screens/Pricereceipt';
import Language from '../Screens/Language';
import Country from '../Screens/Country';
import LocationScreen from '../Screens/Locationsearch';
import Infosize from '../Screens/Infosize';
import Infotopping from '../Screens/Infotopping';

const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="About Restaurant"
          component={AboutRestaurant}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchResto"
          component={SearchResto}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Filter"
          component={Filter}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchLocation"
          component={SearchLocation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TabNavigation"
          component={TabNavigation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Personalinformation"
          component={Personalinformation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Address"
          component={Address}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Favourites"
          component={Favourites}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Seeall"
          component={Seeall}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Paymentmethod"
          component={Paymentmethod}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Aboutus"
          component={Aboutus}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Review"
          component={Reviews}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Finalpage"
          component={Finalpage}
          options={{headerShown: false}}
        />

<Stack.Screen
          name="Pricereceipt"
          component={Pricereceipt}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Language"
          component={Language}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Country"
          component={Country}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Locationsearch"
          component={LocationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Infosize"
          component={Infosize}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Infotopping"
          component={Infotopping}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen name='Test' component={DeliveryOptions}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigation;