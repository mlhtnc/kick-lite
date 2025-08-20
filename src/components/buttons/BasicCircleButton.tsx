import { StyleSheet, View, ViewStyle, GestureResponderEvent, TouchableOpacity } from "react-native";
import Icon from '@react-native-vector-icons/ionicons';
import { Colors } from "../../constants";


interface BasicCircleButtonProps {
  style?: ViewStyle;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  iconName: string;
  iconSize: number;
}

export default function BasicCircleButton({ style, onPress, disabled, iconName, iconSize }: BasicCircleButtonProps) {

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled}>
      <Icon name={iconName as any} size={iconSize} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});