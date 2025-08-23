import { FlatList, StyleSheet } from 'react-native';

import { ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';


export default function ChannelList({ navigation, channels }: ChannelListProps) {

  return (
    <FlatList
      style={styles.listStyle}
      data={channels}
      renderItem={({item: channel}) => <ChannelCard channel={channel} navigation={navigation} /> }
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  listStyle: {
    padding: 10
  }
});