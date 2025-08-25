import { BaseToast } from "react-native-toast-message";

import { Colors } from "../constants";
import { StyleSheet } from "react-native";


export const mainToastConfig = {

  success: (props: any) => (
    <BaseToast
      {...props}
      style={[ styles.style, { borderLeftColor: Colors.success } ]}
      contentContainerStyle={[ styles.contentContainerStyle, { backgroundColor: Colors.success }]}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={[ styles.style, { borderLeftColor: Colors.error } ]}
      contentContainerStyle={[ styles.style, { backgroundColor: Colors.error } ]}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
};


const styles = StyleSheet.create({
  style: {
    borderWidth: 0,
    height: 70,
    padding: 0,
    margin: 0
  },
  contentContainerStyle: {
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    padding: 0,
    margin: 0
  },
  text1Style: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.toastText,
    margin: 0,
    padding: 0,
  },
  text2Style: {
    fontSize: 14,
    color: Colors.toastText,
    margin: 0,
    padding: 0,
  }
});