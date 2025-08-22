import { StyleSheet, View, TouchableNativeFeedback, Text, ViewStyle, TextStyle, GestureResponderEvent, ColorValue, StyleProp, TouchableOpacity } from "react-native";
import { Colors } from "../../constants";

interface BasicButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export default function BasicButton({ style, textStyle, text, onPress, disabled }: BasicButtonProps) {
  
  return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    backgroundColor: Colors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
});