import { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  TextInput,
  TextInputSubmitEditingEvent,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from 'react-native';
import Video, { OnBufferData, VideoRef } from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { Immersive } from 'react-native-immersive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StreamScreenProps } from '../types';
import { getStreamURL } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorSendingMessage, showErrorUnabletoStream, showSuccessSendingMessage } from '../alerts/alerts';
import BasicCircleButton from '../components/buttons/BasicCircleButton';
import ChannelInfo from '../components/ChannelInfo';
import { postMessage } from '../services/kick_service';


const screenDimensions = Dimensions.get('screen');

export default function StreamScreen({ route }: StreamScreenProps) {
  
  const videoRef = useRef<VideoRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const [ streamURL, setStreamURL ] = useState<string>("");
  const [ messageText, setMessageText ] = useState<string>("");
  const [ paused, setPaused ] = useState(false);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(screenDimensions);
  const [ showControl, setShowControl ] = useState<boolean>(false);
  const [ loadingVideo, setLoadingVideo ] = useState<boolean>(false);
  const [ offset, setOffset ] = useState<number>(0);

  const { channel, tokens } = route.params;

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setOffset(0));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setOffset(-insets.top));
    const dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => setScreenSize(screen));

    fetchStreamURL();

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      dimensionSubscription?.remove();
    };
  }, []);


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
      StatusBar.setHidden(false);
    } else {
      Immersive.on();
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
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

  const handleSendMessage = (e: TextInputSubmitEditingEvent) => {
    postMessage(
      tokens.accessToken,
      channel.id,
      messageText.substring(0, 500),
    ).then(() => {
      // FIXME: Check response
      showSuccessSendingMessage();
    }).catch(() => {
      showErrorSendingMessage();
    });

    setMessageText("");
  }


  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;
  const WrapperView = isFullscreen ? View : SafeAreaView;
  const playPauseIconName = paused ? "play-outline" : "pause-outline";


  return (
    <WrapperView style={styles.container} >
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={offset} >

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
            onLoadStart={() => setLoadingVideo(true)}
            onLoad={() => setLoadingVideo(false)}
            onBuffer={(e: OnBufferData) => setLoadingVideo(e.isBuffering)}
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

          { loadingVideo || streamURL === "" && <ActivityIndicator size={'large'} color={Colors.success} /> }

        </TouchableOpacity>
 
      </View>

      { !isFullscreen &&
        <>
          <ChannelInfo channel={channel} tokens={tokens} />
          <View style={{ flex: 1, alignSelf: "stretch", justifyContent: "flex-end"}}>

            <TextInput
              style={styles.searchInput}
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={handleSendMessage}
            />

          </View>
        </>
      }
      </KeyboardAvoidingView>
    </WrapperView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,

  },
  videoContainer: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  video: {
    width: '100%',
    height: '100%',
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
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
    width: 30,
    height: 30
  },
  searchInput: {
    height: 50,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    color: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    padding: 0,
  },
});