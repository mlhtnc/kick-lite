import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { Immersive } from 'react-native-immersive';

import { StreamScreenProps } from '../types';
import { getStreamURL } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorUnabletoStream } from '../alerts/alerts';
import { SafeAreaView } from 'react-native-safe-area-context';


const screenDimensions = Dimensions.get('screen');

export default function StreamScreen({ navigation, route }: StreamScreenProps) {
  
  const videoRef = useRef<VideoRef>(null);
  
  const [ streamURL, setStreamURL ] = useState<string>("");
  const [ paused, setPaused ] = useState(false);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(screenDimensions);

  const { channel } = route.params;


  useEffect(() => {
    fetchStreamURL();

    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setScreenSize(screen);
    });

    return () => subscription?.remove();
  }, []);

  const fetchStreamURL = () => {
    getStreamURL(channel.slug)
    .then((res) => {
      setStreamURL(res.streamURL)
    }).catch(() => {
      showErrorUnabletoStream();
    });
  }

  const togglePlayPause = () => setPaused(!paused);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      Immersive.off();
      Orientation.lockToPortrait();
    } else {
      Immersive.on();
      Orientation.lockToLandscape();
    }
    setIsFullscreen((prevIsFullscreen) => !prevIsFullscreen);
  }


  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;
  const WrapperView = isFullscreen ? View : SafeAreaView;

  return (
    <WrapperView style={styles.container}>

      { streamURL !== "" &&
        <View style={{ width: videoWidth, height: videoHeight, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" }}>
          <Video
            ref={videoRef}
            source={{ uri: streamURL }}
            style={styles.video}
            resizeMode='contain'
            playInBackground={true}
            playWhenInactive={true}
            paused={paused}
            ignoreSilentSwitch='ignore'
          />

          <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
              <Text style={styles.buttonText}>{paused ? 'Play' : 'Pause'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleFullscreen} style={styles.button}>
              <Text style={styles.buttonText}>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      } 
      
    </WrapperView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  video: {
    width: '100%',
    height: '100%'
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
});