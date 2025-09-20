import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MainStackParamList, Screens } from "../types";
import { Colors } from "../constants";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";


const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName={Screens.Login}
      screenOptions={{
        contentStyle: styles.contentStyle,
        headerShown: false,
        animation: 'none'
      }}
    >
      <Stack.Screen name={Screens.Login} component={LoginScreen} />
      <Stack.Screen name={Screens.Home} component={HomeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    backgroundColor: Colors.background
  }
});