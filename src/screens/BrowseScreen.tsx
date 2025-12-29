import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, User } from '../types';
import { getLivestreams, getUsers } from '../services/kick_service';
import ChannelList from '../components/ChannelList';
import { showErrorChannelsLoading, showErrorUserLoading } from '../alerts/alerts';
import { useBrowsedChannelListStore } from '../stores/browsedChannelListStore';
import usePlayerIntentHandler from '../components/hooks/usePlayerIntentHandler';


export default function BrowseScreen() {

  const [ loading, setLoading ] = useState<boolean>(false);
  const { channels, setChannels } = useBrowsedChannelListStore();

  usePlayerIntentHandler();

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
  const userIds = channels.map((ch) => ch.id);

  try {
    const users = await getUsers(userIds);
    const userRecords = Object.fromEntries(
      users.map(item => [item.id, item])
    ) as Record<string, User>;

    return channels.map((ch) => {
      return { ...ch, name: userRecords[ch.id].name};
    });

  } catch (err) {
    showErrorUserLoading();
    return channels;
  }
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




