import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, ChannelCardProps, Screens } from '../types';
import { formatViewerCount } from '../helpers/helpers';


export default function ChannelCard({ navigation, channel }: ChannelCardProps) {


  const handleChannelClick = (channel: Channel) => {
    if(!channel.isLive) {
      return;
    }
    
    navigation.navigate(Screens.Stream, { channel: channel })
  }

  const viewerCountFormatted = formatViewerCount(channel.viewerCount);
  
  return (
    <View style={styles.listItemContainer}>
    
      <TouchableOpacity style={styles.listItemButton} onPress={() => handleChannelClick(channel)} activeOpacity={0.7}>

        <View style={styles.listItemButtonContainer}>
          <View style={styles.textContainer1}>
            <Text style={styles.nameText}>{channel.name}</Text>
            <Text style={styles.viewerCountText}>{channel.viewerCount > 0 ? viewerCountFormatted : ""}</Text>

          </View>

          <View style={styles.textContainer2}>
            <Text style={styles.streamTitleText}>{channel.streamTitle}</Text>

          </View>
        </View>

      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 100,
    backgroundColor: Colors.background,
    marginBottom: 10,
  },
  listItemButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20
  },
  listItemButtonContainer: {
    flex: 1,
  },
  textContainer1: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "stretch"
  },
  textContainer2: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  nameText: {
    flex: 5,
    color: Colors.textPrimary,
    fontSize: 18,
  },
  streamTitleText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  viewerCountText: {
    flex: 1,
    fontWeight: "bold",
    color: Colors.textAccent,
    fontSize: 16,
    textAlign: "right"
  }
});