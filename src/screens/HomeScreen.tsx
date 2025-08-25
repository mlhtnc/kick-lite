import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, HomeScreenProps, Screens } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { getChannels, getUser } from '../services/kick_service';
import ChannelList from '../components/ChannelList';
import { showErrorChannelsLoading, showErrorUserLoading } from '../alerts/alerts';
import { loadChannels } from '../utils/save_utils';


export default function HomeScreen({ navigation, route }: HomeScreenProps) {

  const { tokens } = route.params;

  const [ channels, setChannels ] = useState<Channel[]>();


  useEffect(() => {
    initChannels();
  }, []);

  const initChannels = async () => {
    const channels = await loadChannels();

    getChannels(tokens.accessToken, channels.map((ch: Channel) => ch.slug))
    .then(async (channels) => {
      let updatedChannels = await fetchChannelUsernames(channels);
      sortChannels(updatedChannels);
      setChannels(updatedChannels);
    }).catch(() => {
      showErrorChannelsLoading();
    });
  }

  const fetchChannelUsernames = async (channels: Channel[]) => {
    let error: boolean = false;

    const updatedChannels = await Promise.all(
      channels.map(async (ch) => {
        try {
          const user = await getUser(tokens.accessToken, ch.id);
          return { ...ch, name: user.name };
        } catch (err) {
          error = true;
          return ch;
        }
      })
    );

    if(error) {
      showErrorUserLoading();
    }

    return updatedChannels;
  }

  const sortChannels = (channels: Channel[]) => {
    return channels.sort((a, b) => {
      if (a.isLive !== b.isLive) {
        return a.isLive ? -1 : 1;
      }

      return b.viewerCount - a.viewerCount;
    });
  }

  const onChannelAdded = (): void => {
    initChannels();
  }

  const onSearchButtonPressed = () => {
    navigation.navigate(Screens.Search, { tokens, onChannelAdded });
  }


  return (
    <View style={styles.container}>
      <ScreenHeader title={"Kick Lite"} onSearchButtonPressed={onSearchButtonPressed}/>
      
      <View style={styles.listContainer}>
        <ChannelList channels={channels || []} navigation={navigation}/>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
});




