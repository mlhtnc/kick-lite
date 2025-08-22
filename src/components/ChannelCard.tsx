import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, ChannelCardProps } from '../types';
import Ionicons from '@react-native-vector-icons/ionicons';


export default function ChannelCard({ channel }: ChannelCardProps) {


  const handleChannelClick = (channel: Channel) => {
    // TODO:
    console.log(channel);
  }

  
  return (
    <View style={styles.listItemContainer}>
    
      <TouchableOpacity style={styles.listItemButton} onPress={() => handleChannelClick(channel)} activeOpacity={0.7}>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: Colors.textPrimary, fontWeight:"bold", fontSize: 18}}>{channel.name}</Text>
            <Text style={{color: Colors.textSecondary, fontSize: 16}}>{channel.streamTitle}</Text>
          </View>

          <Ionicons name='chevron-forward-outline' size={24} color={Colors.textSecondary} style={{flex: 0.05}} />

        </View>

      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 80,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listItemButton: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background
  }
});