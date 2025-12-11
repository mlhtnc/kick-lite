import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StreamScreenProps, StreamURL } from '../types';
import { getStreamURLs } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorUnabletoStream } from '../alerts/alerts';
import ChatInput from '../components/stream/ChatInput';
import ChatFeed from '../components/stream/ChatFeed';
import { GlobalKAVBehaviour } from '../helpers/helpers';
import Player from '../components/stream/Player';
import StreamInfo from '../components/stream/StreamInfo';
import { useBackgroundServiceInfo } from '../stores/backgroundServiceStore';
import ForegroundService from '../modules/ForegroundService';


export default function StreamScreen({ route }: StreamScreenProps) {
  
  const [ streamURLs, setStreamURLs ] = useState<StreamURL[]>();
  const [ offset, setOffset ] = useState<number>(0);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ isStreamReady, setIsStreamReady ] = useState<boolean>(false);
  const [ selectedQuality, setSelectedQuality ] = useState<StreamURL>();
  
  const { channel } = route.params;

  const insets = useSafeAreaInsets();

  const { setIsRunning } = useBackgroundServiceInfo.getState();


  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setOffset(insets.top));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setOffset(0));

    fetchStreamURL();

    const { isRunning } = useBackgroundServiceInfo.getState();
    if(!isRunning) {
      ForegroundService.start();
      setIsRunning(true);
    }

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      
      const { isRunning } = useBackgroundServiceInfo.getState();
      if(isRunning) {
        ForegroundService.stop();
        setIsRunning(false);
      }
    };
  }, []);


  const fetchStreamURL = () => {
    getStreamURLs(channel.slug)
    .then((res) => {
      const sortedURLs = res.sort((a: StreamURL, b: StreamURL) => b.height - a.height);

      setStreamURLs(sortedURLs);
      setIsStreamReady(true);
    }).catch(() => {
      showErrorUnabletoStream();
    });
  }


  return (
    <View style={[styles.container, !isFullscreen ? { marginTop: insets.top, marginBottom: insets.bottom } : undefined]}>

      <Player
        streamURLs={streamURLs}
        startTime={channel.startTime}
        selectedQuality={selectedQuality}
        isFullscreen={isFullscreen}
        isStreamReady={isStreamReady}
        setIsFullscreen={setIsFullscreen}
        setSelectedQuality={setSelectedQuality}
      />

      { !isFullscreen &&
        <KeyboardAvoidingView style={{flex: 1}} behavior={GlobalKAVBehaviour} keyboardVerticalOffset={ offset } >
          <StreamInfo channel={channel} />
          <ChatFeed/>
          <ChatInput channel={channel} />
        </KeyboardAvoidingView>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,
  },
});