import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BootSplash from "react-native-bootsplash";

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StreamScreen from './src/screens/StreamScreen';
import SearchScreen from './src/screens/SearchScreen';
import SleepTimerScreen from './src/screens/SleepTimerScreen';
import { MainStackParamList, RootStackParamList, RootTabParamList, Screens } from './src/types';
import { mainToastConfig } from './src/toast_types/toast_types';
import { Colors } from './src/constants';
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import useSleepTimerInBackground from './src/components/hooks/useSleepTimerInBackground';


const Stack = createNativeStackNavigator<MainStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();


function MainStack() {
	return (
		<Stack.Navigator
      initialRouteName={Screens.Login}
      screenOptions={{
        contentStyle: styles.rootContentStyle,
        headerShown: false,
        animation: 'none'
      }}
    >
      <Stack.Screen name={Screens.Login} component={LoginScreen} />
      <Stack.Screen name={Screens.Home} component={HomeScreen} />
    </Stack.Navigator>
	);
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: styles.tabBarStyle,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.buttonPrimary,
        animation: 'none',
        tabBarIcon: ({ color, size }) => {
          let iconName: IoniconsIconName = 'home-outline';

          if (route.name === Screens.MainStack) {
            iconName = 'home-outline';
          } else if (route.name === Screens.SleepTimer) {
            iconName = 'moon-outline';
          } else if (route.name === Screens.Search) {
            iconName = 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name={Screens.MainStack} component={MainStack} />
      <Tab.Screen name={Screens.SleepTimer} component={SleepTimerScreen} />
      <Tab.Screen name={Screens.Search} component={SearchScreen} />
    </Tab.Navigator>
  );
}

export default function App() {

  useSleepTimerInBackground();

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <StatusBar
        translucent={false}
        backgroundColor={"transparent"}
        barStyle="light-content"
      />

      <NavigationContainer onReady={() => BootSplash.hide() } >
        <RootStack.Navigator
          initialRouteName={Screens.MainTabs}
          screenOptions={{
            contentStyle: styles.rootContentStyle,
            headerShown: false,
            animation: 'none'
          }}
        >
          <RootStack.Screen name={Screens.MainTabs} component={MainTabs} />
          <RootStack.Screen name={Screens.Stream} component={StreamScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast config={mainToastConfig} visibilityTime={5000} swipeable />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    backgroundColor: Colors.background
  },
  rootContentStyle: {
    backgroundColor: Colors.background
  },
  contentStyle: {
    backgroundColor: Colors.background
  },
  tabBarStyle: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.background
  }
});