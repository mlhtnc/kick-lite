import { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
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
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SleepTimerBottomSheet from '../components/SleepTimerBottomSheet';


export default function StreamScreen({ route }: StreamScreenProps) {
  
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);

  const [ streamURLs, setStreamURLs ] = useState<StreamURL[]>();
  const [ offset, setOffset ] = useState<number>(0);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ isStreamReady, setIsStreamReady ] = useState<boolean>(false);
  const [ selectedQuality, setSelectedQuality ] = useState<StreamURL>();
  const [ isBottomSheetOpen, setIsBottomSheetOpen ] = useState<boolean>(false);

  const { channel } = route.params;

  const insets = useSafeAreaInsets();

  const { setIsRunning, setEndTime } = useBackgroundServiceInfo.getState();


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
        setEndTime(-1);
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

  const handleSheetChanges = (index: number) => {
    setIsBottomSheetOpen(index !== -1);
  }


  return (
    <GestureHandlerRootView style={[styles.container, !isFullscreen ? { marginTop: insets.top, marginBottom: insets.bottom } : undefined]}>

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
          <ChatInput channel={channel} bottomSheetRef={sheetRef} />
        </KeyboardAvoidingView>
      }

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#222" }}
        onChange={handleSheetChanges}
      >
        <SleepTimerBottomSheet isOpen={isBottomSheetOpen} />
      </BottomSheet>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,
  },
});