import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons, { IoniconsIconName } from "@react-native-vector-icons/ionicons";

import { RootTabParamList, Screens } from "../types";
import { Colors } from "../constants";
import BrowseScreen from "../screens/BrowseScreen";
import SearchScreen from "../screens/SearchScreen";
import HomeScreen from "../screens/HomeScreen";
import { usePlayerIntent } from "../stores/playerIntentStore";
import useOverrideBackPress from "../components/hooks/useOverrideBackPress";
import { usePlayerStore } from "../stores/playerStore";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabs() {
  
  const requestCloseStream = usePlayerIntent(s => s.requestCloseStream);
  
  useOverrideBackPress(useCallback(() => {
    if(usePlayerStore.getState().mode !== "hidden") {
      requestCloseStream();
      return true;
    }
    return false;
  }, []));
  
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerStyle: styles.headerStyle,
        headerTintColor: Colors.textPrimary,
        headerShown: true,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.buttonPrimary,
        animation: 'none',
        tabBarIcon: ({ color, size }) => {
          let iconName: IoniconsIconName = 'home-outline';

          if (route.name === Screens.Home) {
            iconName = 'home-outline';
          } else if (route.name === Screens.Browse) {
            iconName = 'albums-outline';
          } else if (route.name === Screens.Search) {
            iconName = 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name={Screens.Home} component={HomeScreen} options={{ title: "Kick Lite" }} />
      <Tab.Screen name={Screens.Browse} component={BrowseScreen} options={{ title: "Browse" }} />
      <Tab.Screen name={Screens.Search} component={SearchScreen} options={{ headerShown: false  }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 0
  },
  tabBarStyle: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.background
  },
  tabBarIconStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});