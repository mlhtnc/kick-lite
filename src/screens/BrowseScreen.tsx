import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { Channel } from '../types';
import { getLivestreams, getUser } from '../services/kick_service';
import ChannelList from '../components/ChannelList';
import { showErrorChannelsLoading, showErrorUserLoading } from '../alerts/alerts';
import { useBrowsedChannelListStore } from '../stores/browsedChannelListStore';


export default function BrowseScreen() {

  const [ loading, setLoading ] = useState<boolean>(false);
  const { channels, setChannels } = useBrowsedChannelListStore();


  useEffect(() => {
    fetchLivestreams();
  }, []);


  const fetchLivestreams = async () => {
    setLoading(true);
    getLivestreams()
    .then(async (channels) => {
      let updatedChannels = await fetchChannelUsernames(channels);
      setChannels(updatedChannels);
    }).catch((err: Error) => {
      showErrorChannelsLoading("Browse " + err.message);
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

  const onRefresh = () => {
    fetchLivestreams();
  }


  return (
    <View style={styles.container}>
      
      <View style={styles.listContainer}>
        <ChannelList
          channels={channels || []}
          loading={loading}
          onRefresh={onRefresh}
        />
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




