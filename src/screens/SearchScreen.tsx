import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Channel, SearchScreenProps } from '../types';
import { Colors } from '../constants';
import BasicCircleButton from '../components/buttons/BasicCircleButton';
import { getChannels } from '../services/kick_service';
import { showErrorChannelsLoading } from '../alerts/alerts';
import { loadChannels, saveChannels } from '../utils/save_utils';



export default function SearchScreen({ navigation, route }: SearchScreenProps) {

  const { tokens, onChannelAdded } = route.params;

  const [ searchText, setSearchText ] = useState<string>("");
  const [ resultChannel, setResultChannel ] = useState<Channel>();

  const onSearchButtonPressed = () => {
    getChannels(tokens.accessToken, [searchText])
    .then(async (channels) => {
      if(channels.length === 1) {
        setResultChannel(channels[0]);
      } else {
        setResultChannel(undefined);
      }
    }).catch(() => {
      showErrorChannelsLoading();
    });
  }

  const onAddButtonPressed = async () => {
    const channels = await loadChannels();
    await saveChannels([ ...channels, resultChannel ]);

    onChannelAdded();
    navigation.goBack();
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.content}>

          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearchButtonPressed}
          />
              
          <BasicCircleButton style={{backgroundColor: Colors.background}} iconName='search' iconSize={24} onPress={onSearchButtonPressed}></BasicCircleButton>
        </View>
      </View>
      
      <View style={styles.resultContainer}>

        { resultChannel ? 
          <View style={styles.result}>
            <Text style={styles.resultText}>{resultChannel.slug}</Text>
            <BasicCircleButton
              style={{backgroundColor: Colors.background}}
              iconName='add-circle-outline'
              iconSize={30}
              iconColor={Colors.textAccent}
              onPress={onAddButtonPressed} />
          </View>
          :
          <Text style={styles.noResultText}>No Result</Text>
        }

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,
		justifyContent: 'flex-start',
  },
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
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 5,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: Colors.textSecondary,
    marginRight: 10,
    padding: 0
  },
  resultContainer: {
    marginHorizontal: 20,
    marginTop: 20
  },
  result: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  resultText: {
    color: Colors.textPrimary,
    fontSize: 18
  },
  noResultText: {
    marginTop: 10,
    color: Colors.textPrimary,
    fontSize: 18,
    textAlign: "center",
  }
});