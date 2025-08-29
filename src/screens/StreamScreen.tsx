import { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
  TextInput,
  TextInputSubmitEditingEvent,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StreamOverlayHandles, StreamScreenProps } from '../types';
import { getStreamURL } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorSendingMessage, showErrorUnabletoStream, showSuccessSendingMessage } from '../alerts/alerts';
import ChannelInfo from '../components/ChannelInfo';
import { postMessage } from '../services/kick_service';
import StreamPlayer from '../components/StreamPlayer';
import StreamOverlay from '../components/StreamOverlay';


const screenDimensions = Dimensions.get('screen');

export default function StreamScreen({ route }: StreamScreenProps) {
  
  const overlayRef = useRef<StreamOverlayHandles>(null);

  const [ streamURL, setStreamURL ] = useState<string>("");
  const [ messageText, setMessageText ] = useState<string>("");
  const [ paused, setPaused ] = useState(false);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(screenDimensions);
  const [ loadingVideo, setLoadingVideo ] = useState<boolean>(false);
  const [ offset, setOffset ] = useState<number>(0);
  const [ isStreamReady, setIsStreamReady ] = useState<boolean>(false);

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
          overlayRef.current?.toggleFullscreen();
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
      setStreamURL(res.streamURL);
      setIsStreamReady(true);
    }).catch(() => {
      showErrorUnabletoStream();
    });
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
  const kavBehavior = Platform.OS === "ios" ? "padding" : "height";
  const WrapperView = isFullscreen ? View : SafeAreaView;


  return (
    <WrapperView style={styles.container} >
      <KeyboardAvoidingView style={{flex: 1}} behavior={kavBehavior} keyboardVerticalOffset={offset} >

      <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
      
        <StreamPlayer
          streamURL={streamURL}
          paused={paused}
          setLoadingVideo={setLoadingVideo}
        />
        
        <StreamOverlay
          ref={overlayRef}
          isStreamReady={isStreamReady}
          isLoading={loadingVideo}
          paused={paused}
          isFullscreen={isFullscreen}
          setPaused={setPaused}
          setIsFullscreen={setIsFullscreen}
        />
 
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