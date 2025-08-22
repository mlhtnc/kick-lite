import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { Channel, HomeScreenProps, User } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { getChannels, getUser } from '../services/kick_service';
import ChannelList from '../components/ChannelList';


export default function HomeScreen({ navigation, route }: HomeScreenProps) {

  const { tokens } = route.params;

  const [ channels, setChannels ] = useState<Channel[]>();

  useEffect(() => {
    test();
  }, []);

  
  const test = () => {
    getChannels(tokens.accessToken, ["jahrein", "ilkinsan", "chips", "bishopirl"])
    .then(async (channels) => {

      const updated = await Promise.all(
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

      setChannels(updated);
    }).catch((err) => {
      console.log(err);
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