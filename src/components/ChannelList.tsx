import { FlatList, StyleSheet } from 'react-native';

import { ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';


export default function ChannelList({ navigation, channels, tokens, loading, onRefresh, onChannelDelete }: ChannelListProps) {

  return (
    <FlatList
      style={styles.listStyle}
      data={channels}
      renderItem={({item: channel}) => <ChannelCard channel={channel} tokens={tokens} navigation={navigation} onChannelDelete={onChannelDelete} /> }
      refreshing={loading}
      onRefresh={onRefresh}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  listStyle: {
    padding: 25
  }
});