import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Keyboard, View, Dimensions } from 'react-native';
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
import { useCurrentChannel } from '../stores/currentChannelStore';
import useOverrideBackPress from '../components/hooks/useOverrideBackPress';
import { useBackgroundServiceInfo } from '../stores/backgroundServiceStore';
import ForegroundService from '../modules/ForegroundService';

export default function StreamScreen({ route }: StreamScreenProps) {
  
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const insets = useSafeAreaInsets();

  const [ offset, setOffset ] = useState<number>(0);
  const [ isBottomSheetOpen, setIsBottomSheetOpen ] = useState<boolean>(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(Dimensions.get('screen'));
  const [ layoutReady, setLayoutReady ] = useState(false);

  const mode = usePlayerStore(s => s.mode);
  const setStreamKey = usePlayerStore(s => s.setStreamKey);
  const setSource = usePlayerStore(s => s.setSource);
  const setMode = usePlayerStore(s => s.setMode);
  const setStreamUrls = usePlayerStore(s => s.setStreamUrls);
  const setSelectedQuality = usePlayerStore(s => s.setSelectedQuality);
  const setStartTime = usePlayerStore(s => s.setStartTime);
  const isFullscreen = usePlayerStore(s => s.isFullscreen);
  
  const setCurrentChannel = useCurrentChannel(s => s.setCurrentChannel);

  const { channel } = route.params;

  useEffect(() => {
    const unmount = () => setMode("mini-player");

    if(!layoutReady) {
      return unmount;
    }

    setMode("portrait");
    if(mode === "mini-player" && channel.slug === useCurrentChannel.getState().currentChannel?.slug) {
      return unmount;
    }

    if(channel.slug !== useCurrentChannel.getState().currentChannel?.slug) {
      setSource("");
      setStreamUrls(undefined);
      setSelectedQuality(undefined);
      setStartTime("");
      setCurrentChannel(channel);
      setStreamKey(channel.slug);
    }

    fetchStreamURL();
    setStartTime(channel.startTime);

    return unmount;
  }, [layoutReady]);

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

  useEffect(() => {
    const dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => setScreenSize(screen));
    return () => dimensionSubscription?.remove();
  }, []);

  useEffect(() => {
    const { isRunning, setIsRunning } = useBackgroundServiceInfo.getState();
    if(!isRunning) {
      ForegroundService.start();
      setIsRunning(true);
    }
  }, []);

  useOverrideBackPress(useCallback(() => {
    if (isFullscreen()) {
      setMode("portrait");
      return true;
    }
    return false;
  }, []));

  const onLayout = () => {
    if (!layoutReady) {
      setLayoutReady(true);
    }
  };

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

  const videoWidth = screenSize.width;
  const videoHeight = (videoWidth * 9) / 16;

  return (
    <GestureHandlerRootView
      style={[styles.container, !isFullscreen() ? { marginTop: insets.top, marginBottom: insets.bottom } : undefined]}
      onLayout={onLayout}  
    >

      <View style={{width: videoWidth, height: videoHeight}} />

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