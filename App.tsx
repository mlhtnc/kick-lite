import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { Colors, HomeScreenName, LoginScreenName } from './src/constants';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} >
        <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
          <NavigationContainer>
            <Stack.Navigator initialRouteName={LoginScreenName} screenOptions={{ headerShown: false, animation: 'none' }}>
              <Stack.Screen name={LoginScreenName} component={LoginScreen} />
              <Stack.Screen name={HomeScreenName} component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}