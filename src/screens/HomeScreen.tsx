import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import ChannelList from '../components/ChannelList';
import { useChannelListStore } from '../stores/channelListStore';
import DeleteChannelModal from '../components/DeleteChannelModal';
import { Channel } from '../types';

export default function HomeScreen() {

  const [ deleteChannelModalVisible, setDeleteChannelModalVisible ] = useState<boolean>(false);
  const [ selectedChannel, setSelectedChannel ] = useState<Channel | null>(null);

  const channels = useChannelListStore((s) => s.channels);
  const channelsLoading = useChannelListStore((s) => s.channelsLoading);
  const fetchChannels = useChannelListStore((s) => s.fetchChannels);
  const removeChannel = useChannelListStore((s) => s.removeChannel);

  useEffect(() => fetchChannels(), []);

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




