import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, ChannelCardProps, RootStackParamList, Screens } from '../types';
import { formatViewerCount } from '../helpers/helpers';
import BasicButton from './buttons/BasicButton';
import { useChannelListStore } from '../stores/channelListStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export default function ChannelCard({ channel }: ChannelCardProps) {

  const [ isDeleteButtonShowing, setIsDeleteButtonShowing ] = useState<boolean>(false);
  const { removeChannel } = useChannelListStore();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  
  const handleChannelClick = (channel: Channel) => {
    if(!channel.isLive) {
      return;
    }
    
    rootNavigation.navigate(Screens.Stream, { channel });
  }

  const handleChannelLongClick = () => {
    setIsDeleteButtonShowing(true);

    setTimeout(() => {
      setIsDeleteButtonShowing(false);
    }, 2000);
  }


  const viewerCountFormatted = formatViewerCount(channel.viewerCount);
  
  return (
    <View style={styles.listItemContainer}>
    
      { isDeleteButtonShowing ?
        <BasicButton
          text='DELETE'
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          onPress={() => removeChannel(channel)}
        />
        :
        <TouchableOpacity
          style={styles.listItemButton}
          onPress={() => handleChannelClick(channel)}
          onLongPress={handleChannelLongClick}
          activeOpacity={0.8}
        >
          <View style={styles.listItemButtonContainer}>
            { channel.thumbnail ?
                <Image
                  style={styles.image}
                  source={{ uri: `${channel.thumbnail}?t=${Date.now()}` }}
                  resizeMode='contain'
                />
              :
              null
            }

            <View style={styles.textContainer1}>
              <Text style={styles.nameText}>{channel.name}</Text>
              <Text style={styles.viewerCountText}>{channel.viewerCount > 0 ? viewerCountFormatted : ""}</Text>
            </View>

            <View style={styles.textContainer2}>
              <Text style={styles.streamTitleText}>{channel.streamTitle}</Text>
            </View>

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
  },
  listItemButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  listItemButtonContainer: {
    flex: 1,
  },
  textContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingTop: 10
  },
  textContainer2: {
    justifyContent: 'flex-start',
  },
  nameText: {
    flex: 4,
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
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 15
  }
});