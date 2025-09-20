import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Channel, SearchScreenProps } from '../types';
import { Colors } from '../constants';
import BasicCircleButton from '../components/buttons/BasicCircleButton';
import { getChannels } from '../services/kick_service';
import { showErrorChannelsLoading } from '../alerts/alerts';
import { useChannelListStore } from '../stores/channelListStore';


export default function SearchScreen({ navigation }: SearchScreenProps) {

  const searchInputRef = useRef<TextInput>(null);

  const [ searchText, setSearchText ] = useState<string>("");
  const [ resultChannel, setResultChannel ] = useState<Channel>();
  const [ isSearching, setIsSearching ] = useState<boolean>(true);

  const { addChannel } = useChannelListStore();


  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    });

    const blurUnsubscribe = navigation.addListener('blur', () => {
      setSearchText("");
      setIsSearching(true);
      setResultChannel(undefined);
    });

    return () => {
      focusUnsubscribe();
      blurUnsubscribe();
    }
  }, [navigation]);

  const onSearchButtonPressed = () => {
    setIsSearching(true);

    getChannels([searchText])
    .then(async (channels) => {
      if(channels.length === 1) {
        setResultChannel(channels[0]);
      } else {
        setResultChannel(undefined);
      }
    }).catch(() => {
      showErrorChannelsLoading();
    }).finally(() => {
      setIsSearching(false);
    });
  }

  const onAddButtonPressed = async () => {
    if(!resultChannel) {
      return;
    }

    addChannel(resultChannel);
    navigation.goBack();
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.content}>

          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearchButtonPressed}
            autoFocus
          />
              
          <BasicCircleButton style={{backgroundColor: Colors.background}} iconName='search' iconSize={24} onPress={onSearchButtonPressed}></BasicCircleButton>
        </View>
      </View>
      
      <View style={styles.resultContainer}>

        { !isSearching && (resultChannel ? 
          <TouchableOpacity style={styles.result} onPress={onAddButtonPressed} activeOpacity={0.7}>
            <Text style={styles.resultText}>{resultChannel.slug}</Text>
            <BasicCircleButton
              style={{backgroundColor: Colors.background}}
              iconName='add-circle-outline'
              iconSize={30}
              iconColor={Colors.textAccent}
              disabled />
          </TouchableOpacity>
          :
          <Text style={styles.noResultText}>No Result</Text>
        )}

      </View>
    </SafeAreaView>
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