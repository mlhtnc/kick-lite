import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../constants';
import { Channel } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { getChannels, getUser } from '../services/kick_service';
import ChannelList from '../components/ChannelList';
import { showErrorChannelsLoading, showErrorUserLoading } from '../alerts/alerts';
import { loadChannels } from '../utils/save_utils';
import { useChannelListStore } from '../stores/channelListStore';


export default function HomeScreen() {

  const [ loading, setLoading ] = useState<boolean>(false);
  const { channels, setChannels } = useChannelListStore();


  useEffect(() => {
    loadSavedChannels();
  }, []);

  useEffect(() => {
    if(channels.length === 0) {
      return;
    }

    fetchChannels();
  }, [channels.length]);


  const loadSavedChannels = async () => {
    const savedChannels = await loadChannels();
    if(savedChannels.length === 0) {
      return;
    }

    setChannels(savedChannels);
  }


  const fetchChannels = async () => {
    setLoading(true);
    getChannels(channels.map((ch: Channel) => ch.slug))
    .then(async (channels) => {
      let updatedChannels = await fetchChannelUsernames(channels);
      sortChannels(updatedChannels);
      setChannels(updatedChannels);
    }).catch(() => {
      showErrorChannelsLoading();
    }).finally(() => {
      setLoading(false);
    });
  }

  const fetchChannelUsernames = async (channels: Channel[]) => {
    let error: boolean = false;

    const updatedChannels = await Promise.all(
      channels.map(async (ch) => {
        try {
          const user = await getUser(ch.id);
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

  const onRefresh = () => {
    fetchChannels();
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={"Kick Lite"} />
      
      <View style={styles.listContainer}>
        <ChannelList
          channels={channels || []}
          loading={loading}
          onRefresh={onRefresh}
        />
      </View>
    
    </SafeAreaView>
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




