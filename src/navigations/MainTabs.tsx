import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons, { IoniconsIconName } from "@react-native-vector-icons/ionicons";

import { RootTabParamList, Screens } from "../types";
import { Colors } from "../constants";
import BrowseScreen from "../screens/BrowseScreen";
import SleepTimerScreen from "../screens/SleepTimerScreen";
import SearchScreen from "../screens/SearchScreen";
import HomeScreen from "../screens/HomeScreen";


const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabs() {
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

          if (route.name === Screens.Home) {
            iconName = 'home-outline';
          } else if (route.name === Screens.Browse) {
            iconName = 'albums-outline';
          } else if (route.name === Screens.SleepTimer) {
            iconName = 'moon-outline';
          } else if (route.name === Screens.Search) {
            iconName = 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name={Screens.Home} component={HomeScreen} />
      <Tab.Screen name={Screens.Browse} component={BrowseScreen} />
      <Tab.Screen name={Screens.SleepTimer} component={SleepTimerScreen} />
      <Tab.Screen name={Screens.Search} component={SearchScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.background
  }
});