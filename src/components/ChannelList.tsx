import { FlatList, StyleSheet } from 'react-native';

import { ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';


export default function ChannelList({ navigation, channels, onChannelDelete }: ChannelListProps) {

  return (
    <FlatList
      style={styles.listStyle}
      data={channels}
      renderItem={({item: channel}) => <ChannelCard channel={channel} navigation={navigation} onChannelDelete={onChannelDelete} /> }
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  listStyle: {
    padding: 10
  }
});