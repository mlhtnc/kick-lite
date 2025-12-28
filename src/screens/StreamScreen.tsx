import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';

import { StreamScreenProps, StreamURL } from '../types';
import { getStreamURLs } from '../services/backend_service';
import { Colors } from '../constants';
import { showErrorUnabletoStream } from '../alerts/alerts';
import ChatInput from '../components/stream/ChatInput';
import ChatFeed from '../components/stream/ChatFeed';
import { GlobalKAVBehaviour } from '../helpers/helpers';
import StreamInfo from '../components/stream/StreamInfo';
import SleepTimerBottomSheet from '../components/SleepTimerBottomSheet';
import { getChannels } from '../services/kick_service';
import { useStreamInfoStore } from '../stores/streamViewerCountStore';
import { usePlayerStore } from '../stores/playerStore';

export default function StreamScreen({ route }: StreamScreenProps) {
  
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const insets = useSafeAreaInsets();

  const [ offset, setOffset ] = useState<number>(0);
  const [ isBottomSheetOpen, setIsBottomSheetOpen ] = useState<boolean>(false);

  const setSource = usePlayerStore(s => s.setSource);
  const setMode = usePlayerStore(s => s.setMode);
  const setStreamUrls = usePlayerStore(s => s.setStreamUrls);
  const setSelectedQuality = usePlayerStore(s => s.setSelectedQuality);
  const setStartTime = usePlayerStore(s => s.setStartTime);
  const isFullscreen = usePlayerStore(s => s.isFullscreen);

  const { channel } = route.params;

  // const { setIsRunning, setEndTime } = useBackgroundServiceInfo.getState();

  useEffect(() => {
    fetchStreamURL();
    setStartTime(channel.startTime);

    return () => {
      setMode("hidden");
    }
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setOffset(insets.top));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setOffset(0));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    useStreamInfoStore.getState().setViewerCount(channel.viewerCount);
    useStreamInfoStore.getState().setStreamTitle(channel.streamTitle);
    const streamInfoIntervalId = setInterval(async () => {
      getChannels([ channel.slug ])
      .then(async (channels) => {
        useStreamInfoStore.getState().setViewerCount(channels[0].viewerCount);
        useStreamInfoStore.getState().setStreamTitle(channels[0].streamTitle);
      }).catch(() => {});
    }, 30000);

    return () => clearInterval(streamInfoIntervalId);
  }, []);

  // We need to add here or somewhere else the mini-player case
  // useEffect(() => {
  //   const { isRunning } = useBackgroundServiceInfo.getState();
  //   if(!isRunning) {
  //     ForegroundService.start();
  //     setIsRunning(true);
  //   }

  //   return () => {
  //     const { isRunning } = useBackgroundServiceInfo.getState();
  //     if(isRunning) {
  //       ForegroundService.stop();
  //       setIsRunning(false);
  //       setEndTime(-1);
  //     }
  //   };
  // }, []);

  const fetchStreamURL = () => {
    getStreamURLs(channel.slug)
    .then((urls) => {
      if(!urls) {
        showErrorUnabletoStream();
        return;
      }

      const sortedURLs = sortUrls(urls);

      setSource(sortedURLs[0].url);
      setSelectedQuality(sortedURLs[0]);
      setStreamUrls(sortedURLs);
      setMode("portrait");
    }).catch(() => {
      showErrorUnabletoStream();
    });
  }

  const sortUrls = (urls: StreamURL[]): StreamURL[] => {
    return urls.sort((a: StreamURL, b: StreamURL) => b.height - a.height);
  }

  const handleSheetChanges = (index: number) => {
    setIsBottomSheetOpen(index !== -1);
  }

  return (
    <GestureHandlerRootView style={[styles.container, !isFullscreen() ? { marginTop: insets.top, marginBottom: insets.bottom } : undefined]}>

      { !isFullscreen() &&
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