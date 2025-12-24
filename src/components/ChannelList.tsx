import { memo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Channel, ChannelListProps } from '../types';
import ChannelCard from './ChannelCard';

export default memo(function ChannelList({ channels, loading, onRefresh, showDeleteChannel = undefined }: ChannelListProps) {

  const renderItem = ({item: channel}: {item: Channel}) => (
    <ChannelCard channel={channel} showDeleteChannel={showDeleteChannel} />
  );

  return (
    <FlatList
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.listStyle}
      windowSize={7}
      data={channels}
      renderItem={renderItem}
      refreshing={loading}
      onRefresh={onRefresh}
      keyExtractor={item => item.id}
    />
  );
});

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 0,
    margin: 0,
  },
  listStyle: {
    padding: 20,
  }
});