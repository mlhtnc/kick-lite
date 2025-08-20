import { useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import { ScreenHeaderProps } from '../types';
import { Colors } from '../constants';
import BasicCircleButton from './buttons/BasicCircleButton';


export default function ScreenHeader({ title, onTitleChanged, hideEditButton=false }: ScreenHeaderProps) {

  const titleRef = useRef<TextInput>(null);

  const [ isEditing, setIsEditing ] = useState<boolean>(false);


  const onTitleChange = (text: string) => {
    onTitleChanged?.(text);
  }

  const toggleEdit = () => {
    // If editing is started, focus the title input
    if (!isEditing) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }

    setIsEditing((prev) => !prev);
  }


  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <TextInput
          ref={titleRef}
          editable={isEditing}
          style={ styles.passInput }
          value={ title }
          onChangeText={ onTitleChange }
        />

        {!hideEditButton &&
          <BasicCircleButton style={{width: 40, height: 40 }} iconName='pencil' iconSize={24} onPress={ toggleEdit } />
        }
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
    justifyContent: 'space-between',
  },
  titleContainer: {
    height: 58,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passInput: {
    width: '80%',
    height: 56,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    fontSize: 20,
    textAlign: 'left',
    padding: 0, // Remove default padding
  },
});