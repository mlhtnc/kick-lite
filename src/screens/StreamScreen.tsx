import { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StreamOverlayHandles, StreamScreenProps } from '../types';
import { getStreamURL } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorUnabletoStream } from '../alerts/alerts';
import StreamInfo from '../components/stream/StreamInfo';
import StreamPlayer from '../components/stream/StreamPlayer';
import StreamOverlay from '../components/stream/StreamOverlay';
import ChatInput from '../components/stream/ChatInput';
import ChatFeed from '../components/stream/ChatFeed';
import useOverrideBackPress from '../components/hooks/useOverrideBackPress';
import { GlobalKAVBehaviour } from '../helpers/helpers';


const screenDimensions = Dimensions.get('screen');

export default function StreamScreen({ route }: StreamScreenProps) {
  
  const overlayRef = useRef<StreamOverlayHandles>(null);

  const [ streamURL, setStreamURL ] = useState<string>("");
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

  useOverrideBackPress(useCallback(() => {
    if (isFullscreen) {
      overlayRef.current?.toggleFullscreen();
      return true;
    }
    return false;
  }, [isFullscreen]))

  const fetchStreamURL = () => {
    getStreamURL(channel.slug)
    .then((res) => {
      setStreamURL(res.streamURL);
      setIsStreamReady(true);
    }).catch(() => {
      showErrorUnabletoStream();
    });
  }


  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;
  const WrapperView = isFullscreen ? View : SafeAreaView;


  return (
    <WrapperView style={styles.container}>

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
        <KeyboardAvoidingView style={{flex: 1}} behavior={GlobalKAVBehaviour} keyboardVerticalOffset={offset}>
          <StreamInfo channel={channel} tokens={tokens} />
          <ChatFeed/>
          <ChatInput channel={channel} tokens={tokens} />
        </KeyboardAvoidingView>
      }

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
});