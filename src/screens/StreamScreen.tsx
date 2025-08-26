import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, BackHandler } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { Immersive } from 'react-native-immersive';

import { StreamScreenProps } from '../types';
import { getStreamURL } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorUnabletoStream } from '../alerts/alerts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import BasicCircleButton from '../components/buttons/BasicCircleButton';


const screenDimensions = Dimensions.get('screen');

export default function StreamScreen({ navigation, route }: StreamScreenProps) {
  
  const videoRef = useRef<VideoRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const [ streamURL, setStreamURL ] = useState<string>("");
  const [ paused, setPaused ] = useState(false);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(screenDimensions);
  const [ showControl, setShowControl ] = useState<boolean>(false);

  const { channel } = route.params;


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isFullscreen) {
          toggleFullscreen();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [isFullscreen])
  );

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

  const togglePlayPause = () => {
    setPaused(!paused);
  }

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

  const onControllersPressed = () => {
    if(showControl) {
      setShowControl(false);
    } else {
      setShowControl(true);

      if(timeoutRef) {
        clearTimeout(timeoutRef.current);
      }

      setTimeout(() => {
        setShowControl(false);
      }, 3000);
    }
  } 


  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;
  const WrapperView = isFullscreen ? View : SafeAreaView;


  const playPauseIconName = paused ? "play-outline" : "pause-outline";

  return (
    <WrapperView style={styles.container}>
      <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
      
        { streamURL !== "" &&
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
        }

        <TouchableOpacity style={styles.controls} onPress={onControllersPressed} activeOpacity={1}>
          { streamURL !== "" && showControl &&
            <>
              <BasicCircleButton style={styles.playPauseButton} iconName={playPauseIconName} iconSize={40} onPress={togglePlayPause} />
              <BasicCircleButton style={styles.fullscreenButton} iconName='expand-outline' iconSize={30} onPress={toggleFullscreen} />
            </>
          }
        </TouchableOpacity>

      </View>
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
  videoContainer: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  video: {
    width: '100%',
    height: '100%'
  },
  controls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0)"
  },
  playPauseButton: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
    backgroundColor: "rgba(0,0,0,0)",
    width: 30,
    height: 30
  }
});