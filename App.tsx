import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StreamScreen from './src/screens/StreamScreen';
import { RootStackParamList, Screens } from './src/types';
import { Colors } from './src/constants';
import { mainToastConfig } from './src/toast_types/toast_types';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} >
        <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={Screens.Login} screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name={Screens.Login} component={LoginScreen} />
            <Stack.Screen name={Screens.Home} component={HomeScreen} />
            <Stack.Screen name={Screens.Stream} component={StreamScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={mainToastConfig} visibilityTime={5000} swipeable />
        </SafeAreaView>
    </SafeAreaProvider>
  );
}