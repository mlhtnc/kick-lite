import { useState } from 'react';
import { StyleSheet, TextInput, TextInputSubmitEditingEvent, View } from 'react-native';

import { ChatInputProps } from '../../types';
import { Colors } from '../../constants';
import { showErrorSendingMessage, showSuccessSendingMessage } from '../../alerts/alerts';
import { postMessage } from '../../services/kick_service';
import BasicCircleButton from '../buttons/BasicCircleButton';


export default function ChatInput({ channel, bottomSheetRef }: ChatInputProps) {
  
  const [ messageText, setMessageText ] = useState<string>("");


  const handleSendMessage = (e: TextInputSubmitEditingEvent) => {
    postMessage(
      channel.id,
      messageText.substring(0, 500),
    ).then(() => {
      showSuccessSendingMessage();
    }).catch(() => {
      showErrorSendingMessage();
    });

    setMessageText("");
  }

  const onSleepTimerPress = () => {
    bottomSheetRef.current?.snapToIndex(0);
  }


  return (
    <View style={styles.container}>
      <BasicCircleButton style={styles.sleepTimerButton} iconName='moon-outline' iconSize={25} onPress={onSleepTimerPress} />
      <TextInput
        style={styles.chatInput}
        value={messageText}
        onChangeText={setMessageText}
        onSubmitEditing={handleSendMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sleepTimerButton: {
    marginLeft: 10,
  },
  chatInput: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    color: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: 16,
    padding: 0,
  },
});