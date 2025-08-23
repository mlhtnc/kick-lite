import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, HomeScreenProps } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { getChannels, getUser } from '../services/kick_service';
import ChannelList from '../components/ChannelList';


export default function HomeScreen({ navigation, route }: HomeScreenProps) {

  const { tokens } = route.params;

  const [ channels, setChannels ] = useState<Channel[]>();

  useEffect(() => {
    initChannels();
  }, []);

  
  const initChannels = () => {
    getChannels(tokens.accessToken, ["jahrein", "ilkinsan", "chips", "bishopirl", "purplebixi", "caglararts", "glomerius", "erlizzy", "ebonivon"])
    .then(async (channels) => {
      let updatedChannels = await fetchChannelUsernames(channels);
      sortChannels(updatedChannels);
      setChannels(updatedChannels);
    }).catch((err) => {
      console.log(err);
    });
  }

  const fetchChannelUsernames = async (channels: Channel[]) => {
    return await Promise.all(
      channels.map(async (ch) => {
        try {
          const user = await getUser(tokens.accessToken, ch.id);
          return { ...ch, name: user.name };
        } catch (err) {
          console.log(err);
          return ch;
        }
      })
    );
  }


  const sortChannels = (channels: Channel[]) => {
    return channels.sort((a, b) => {
      if (a.isLive !== b.isLive) {
        return a.isLive ? -1 : 1;
      }

      return b.viewerCount - a.viewerCount;
    });
  }


  return (
    <View style={styles.container}>
      <ScreenHeader title={"Kick Lite"} hideEditButton={true} />
      
      <View style={styles.listContainer}>

        <ChannelList channels={channels || []} navigation={navigation}/>
      
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
    marginBottom: 70,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
});