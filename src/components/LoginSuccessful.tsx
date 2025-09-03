import Ionicons from "@react-native-vector-icons/ionicons";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants";


export function LoginSuccessful() {

  return (
    <View style={styles.container}>
      <Ionicons name='checkmark-done-outline' color={Colors.success} size={102} />
      <Text style={styles.text}>Logged In</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  text: {
    color: "#fff",
    fontSize: 32
  }
});