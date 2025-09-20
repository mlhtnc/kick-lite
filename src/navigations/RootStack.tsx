import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList, Screens } from "../types";
import { Colors } from "../constants";
import MainTabs from "./MainTabs";
import StreamScreen from "../screens/StreamScreen";
import LoginScreen from "../screens/LoginScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
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
      <Stack.Screen name={Screens.MainTabs} component={MainTabs} />
      <Stack.Screen name={Screens.Stream} component={StreamScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  rootContentStyle: {
    backgroundColor: Colors.background
  }
});