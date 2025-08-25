import { View, StyleSheet, Text, GestureResponderEvent } from 'react-native';

import { ScreenHeaderProps } from '../types';
import { Colors } from '../constants';
import BasicCircleButton from './buttons/BasicCircleButton';


export default function ScreenHeader({ title, onSearchButtonPressed }: ScreenHeaderProps) {

  const handleSearchButtonPressed = (event: GestureResponderEvent) => {
    onSearchButtonPressed?.();
  }

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <Text style={styles.text}>{title}</Text>
        <BasicCircleButton style={{backgroundColor: Colors.background}} iconName='search' iconSize={24} onPress={handleSearchButtonPressed}></BasicCircleButton>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderBottomWidth: 1,
  },
  content: {
    height: 58,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    fontSize: 20,
    textAlign: 'left',
    alignSelf: 'center'
  },
});