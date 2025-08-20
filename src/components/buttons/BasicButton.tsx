import { StyleSheet, View, TouchableNativeFeedback, Text, ViewStyle, TextStyle, GestureResponderEvent, ColorValue, StyleProp } from "react-native";
import { Colors } from "../../constants";

interface BasicButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export default function BasicButton({ style, textStyle, text, onPress, disabled }: BasicButtonProps) {
  
  const flattenedStyle = StyleSheet.flatten(style) as ViewStyle | undefined;

  let bg: ColorValue = '#111';
  if (flattenedStyle?.backgroundColor) {
    bg = flattenedStyle.backgroundColor;
  }
  
  // FIXME: Change this with TouchableOpacity
  return (
    <View style={[styles.button, style, { overflow: "hidden" }]}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#2e2e2e', false)} onPress={onPress} disabled={disabled}>
        <View style={[styles.buttonContentView, { backgroundColor: bg }]}>
          <Text style={textStyle}>{text}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    backgroundColor: Colors.buttonPrimary,
  },
  buttonContentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 25,
  },
});