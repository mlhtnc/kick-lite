import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../constants';
import ChannelList from '../components/ChannelList';
import { useChannelListStore } from '../stores/channelListStore';
import DeleteChannelModal from '../components/DeleteChannelModal';
import { Channel, RootStackParamList, Screens } from '../types';
import { usePlayerIntent } from '../stores/playerIntentStore';
import { useCurrentChannel } from '../stores/currentChannelStore';
import { usePlayerStore } from '../stores/playerStore';

export default function HomeScreen() {

  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [ deleteChannelModalVisible, setDeleteChannelModalVisible ] = useState<boolean>(false);
  const [ selectedChannel, setSelectedChannel ] = useState<Channel | null>(null);

  const channels = useChannelListStore((s) => s.channels);
  const channelsLoading = useChannelListStore((s) => s.channelsLoading);
  const fetchChannels = useChannelListStore((s) => s.fetchChannels);
  const removeChannel = useChannelListStore((s) => s.removeChannel);

  const intent = usePlayerIntent(s => s.intent);
  const clearIntent = usePlayerIntent(s => s.clearIntent);

  const setSource = usePlayerStore(s => s.setSource);
  const setMode = usePlayerStore(s => s.setMode);
  const setStreamUrls = usePlayerStore(s => s.setStreamUrls);
  const setSelectedQuality = usePlayerStore(s => s.setSelectedQuality);
  const setStartTime = usePlayerStore(s => s.setStartTime);

  const currentChannel = useCurrentChannel(s => s.currentChannel);

  useEffect(() => fetchChannels(), []);

  useEffect(() => {
    if (intent === "REQUEST_OPEN_STREAM" && currentChannel) {
      rootNavigation.navigate(Screens.Stream, { channel: currentChannel });
      clearIntent();
    } else if(intent === "REQUEST_CLOSE_STREAM") {
      setSource("");
      setMode("hidden");
      setStreamUrls(undefined);
      setSelectedQuality(undefined);
      setStartTime("");
      clearIntent();
    }
  }, [intent]);

  const showDeleteChannel = useCallback((channel: Channel) => {
    setDeleteChannelModalVisible(true);
    setSelectedChannel(channel);
  }, []);

  const closeDeleteChannelModal = () => {
    setDeleteChannelModalVisible(false);
    setSelectedChannel(null);
  }

  const deleteChannel = () => {
    if(selectedChannel) {
      removeChannel(selectedChannel);
    }

    closeDeleteChannelModal();
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <ChannelList
          channels={channels || []}
          loading={channelsLoading}
          onRefresh={fetchChannels}
          showDeleteChannel={showDeleteChannel}
        />
      </View>

      <DeleteChannelModal
        visible={deleteChannelModalVisible}
        onClose={closeDeleteChannelModal}
        deleteChannel={deleteChannel}
      />
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




