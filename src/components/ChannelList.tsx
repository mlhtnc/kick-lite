import { FlatList } from 'react-native';

import { ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';


export default function ChannelList({ navigation, channels }: ChannelListProps) {

  return (
    <FlatList
      data={channels}
      renderItem={({item: channel}) => <ChannelCard channel={channel} navigation={navigation} /> }
      keyExtractor={item => item.id}
    />
  );
}