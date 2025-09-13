import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BootSplash from "react-native-bootsplash";

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StreamScreen from './src/screens/StreamScreen';
import SearchScreen from './src/screens/SearchScreen';
import SleepTimerScreen from './src/screens/SleepTimerScreen';
import { RootStackParamList, Screens } from './src/types';
import { mainToastConfig } from './src/toast_types/toast_types';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
      <NavigationContainer onReady={() => BootSplash.hide() } >
        <Stack.Navigator initialRouteName={Screens.Login} screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name={Screens.Login} component={LoginScreen} />
          <Stack.Screen name={Screens.Home} component={HomeScreen} />
          <Stack.Screen name={Screens.Stream} component={StreamScreen} />
          <Stack.Screen name={Screens.Search} component={SearchScreen} />
          <Stack.Screen name={Screens.SleepTimer} component={SleepTimerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={mainToastConfig} visibilityTime={5000} swipeable />
    </SafeAreaProvider>
  );
}