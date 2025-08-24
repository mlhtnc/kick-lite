import { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';

import { StreamScreenProps } from '../types';
import { getStreamURL } from '../services/backend_service';
import Orientation from 'react-native-orientation-locker';
import { Colors } from '../constants';


const { width } = Dimensions.get('window');

export default function StreamScreen({ navigation, route }: StreamScreenProps) {

  const { channel } = route.params;

  const [ streamURL, setStreamURL ] = useState<string>("");

  useEffect(() => {
    fetchStreamURL();
  }, []);
 

  const fetchStreamURL = () => {
    getStreamURL(channel.slug)
    .then((res) => {
      setStreamURL(res.streamURL)
    }).catch((err) => {
      console.log(err);
    });
  }

  const onFullscreenPlayerWillPresent = () => {
    Orientation.lockToLandscape();
  }

  const onFullscreenPlayerWillDismiss = () => {
    Orientation.lockToPortrait();
  }


  return (
    <View style={styles.container}>

      { streamURL !== "" ?
        <Video
          source={{ uri: streamURL }}
          style={styles.video}
          resizeMode='contain'
          onFullscreenPlayerWillPresent={onFullscreenPlayerWillPresent}
          onFullscreenPlayerWillDismiss={onFullscreenPlayerWillDismiss}
        />
        :
        null
      } 
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,
		justifyContent: 'flex-start',
		alignItems: 'center',
  },
  video: {
		width: width,
		height: (width * 9) / 16,
		backgroundColor: '#000',
	},
});