import { FlatList, StyleSheet } from 'react-native';

import { ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';


export default function ChannelList({ screenProps, channels, loading, onRefresh }: ChannelListProps) {

  return (
    <FlatList
      contentContainerStyle={{margin: 0, padding: 0}}
      style={styles.listStyle}
      data={channels}
      renderItem={({item: channel}) => <ChannelCard channel={channel} screenProps={screenProps} /> }
      refreshing={loading}
      onRefresh={onRefresh}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  listStyle: {
    padding: 20,
  }
});