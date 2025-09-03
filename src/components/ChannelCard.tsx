import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, ChannelCardProps, Screens } from '../types';
import { formatViewerCount } from '../helpers/helpers';
import BasicButton from './buttons/BasicButton';
import { useState } from 'react';


export default function ChannelCard({ navigation, channel, tokens, onChannelDelete }: ChannelCardProps) {

  const [ isDeleteButtonShowing, setIsDeleteButtonShowing ] = useState<boolean>(false);


  const handleChannelClick = (channel: Channel) => {
    if(!channel.isLive) {
      return;
    }
    
    navigation.navigate(Screens.Stream, { channel, tokens });
  }

  const handleChannelLongClick = () => {
    setIsDeleteButtonShowing(true);

    setTimeout(() => {
      setIsDeleteButtonShowing(false);
    }, 2000);
  }


  const viewerCountFormatted = formatViewerCount(channel.viewerCount);
  
  return (
    <View style={[styles.listItemContainer, !channel.isLive ? { borderWidth: 0 } : null ]}>
    
      { isDeleteButtonShowing ?
        <BasicButton
          text='DELETE'
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          onPress={() => onChannelDelete(channel)}
        />
        :
        <TouchableOpacity
          style={styles.listItemButton}
          onPress={() => handleChannelClick(channel)}
          onLongPress={handleChannelLongClick}
          activeOpacity={0.8}
        >
          <View style={styles.listItemButtonContainer}>
            <View style={styles.textContainer1}>
              <Text style={styles.nameText}>{channel.name}</Text>
              <Text style={styles.viewerCountText}>{channel.viewerCount > 0 ? viewerCountFormatted : ""}</Text>
            </View>

            <View style={styles.textContainer2}>
              <Text style={styles.streamTitleText}>{channel.streamTitle}</Text>
            </View>

            { channel.thumbnail ?
                <Image
                  style={{width: "100%", aspectRatio: 16 / 9, borderBottomRightRadius: 20, borderBottomLeftRadius: 20}}
                  source={{ uri: `${channel.thumbnail}?t=${Date.now()}` }}
                  resizeMode='contain'
                />
              :
              null
            }
          </View>
        </TouchableOpacity>
      }
    </View>

  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: Colors.background,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: 20
  },
  listItemButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20
  },
  listItemButtonContainer: {
    flex: 1,
  },
  textContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingTop: 10
  },
  textContainer2: {
    justifyContent: 'flex-start',
    marginBottom: 15,
    paddingHorizontal: 20,
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
  },
  deleteButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: Colors.error,
    borderRadius: 20
  },
  deleteButtonText: {
    fontSize: 24
  }
});