import { useState } from 'react';
import { StyleSheet, TextInput, TextInputSubmitEditingEvent } from 'react-native';

import { ChatInputProps } from '../../types';
import { Colors } from '../../constants';
import { showErrorSendingMessage, showSuccessSendingMessage } from '../../alerts/alerts';
import { postMessage } from '../../services/kick_service';


export default function ChatInput({ channel, tokens }: ChatInputProps) {
  
  const [ messageText, setMessageText ] = useState<string>("");


  const handleSendMessage = (e: TextInputSubmitEditingEvent) => {
    postMessage(
      tokens.accessToken,
      channel.id,
      messageText.substring(0, 500),
    ).then(() => {
      // FIXME: Check response
      showSuccessSendingMessage();
    }).catch(() => {
      showErrorSendingMessage();
    });

    setMessageText("");
  }


  return (
    <TextInput
      style={styles.chatInput}
      value={messageText}
      onChangeText={setMessageText}
      onSubmitEditing={handleSendMessage}
      secureTextEntry
    />
  );
}

const styles = StyleSheet.create({
  chatInput: {
    height: 50,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    color: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    padding: 0,
  },
});