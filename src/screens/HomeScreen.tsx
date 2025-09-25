import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import ChannelList from '../components/ChannelList';
import { useChannelListStore } from '../stores/channelListStore';


export default function HomeScreen() {

  const { channels, channelsLoading, refreshChannels } = useChannelListStore();

  useEffect(() => {
    refreshChannels();
  }, []);

  return (
    <View style={styles.container}>
      
      <View style={styles.listContainer}>
        <ChannelList
          channels={channels || []}
          loading={channelsLoading}
          onRefresh={refreshChannels}
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




