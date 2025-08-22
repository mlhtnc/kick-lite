import { FlatList } from 'react-native';

import { ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';


export default function ChannelList({ channels }: ChannelListProps) {

  return (
    <FlatList
      data={channels}
      renderItem={({item: channel}) => <ChannelCard channel={channel} /> }
      keyExtractor={item => item.id}
    />
  );
}