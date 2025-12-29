import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Dimensions, DimensionValue, StyleSheet, View } from 'react-native';
import Video, { OnBufferData, VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import ImmersiveMode from 'react-native-immersive-mode';

import Overlay from './Overlay';
import { usePlayerStore } from '../../stores/playerStore';
import { Colors } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type PlayerMode =
  "hidden" |
  "mini-player" |
  "portrait" |
  "fullscreen";

export default function Player() {

  const videoRef = useRef<VideoRef>(null);

  const [ playerKeyId, setPlayerKeyId ] = useState<number>(0); // Used to force re-mount Video component
  const [ loadingVideo, setLoadingVideo ] = useState<boolean>(false); // ??
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(Dimensions.get('screen'));

  const streamKey = usePlayerStore(s => s.streamKey);
  const source = usePlayerStore(s => s.source);
  const mode = usePlayerStore(s => s.mode);
  const muted = usePlayerStore(s => s.muted);
  const paused = usePlayerStore(s => s.paused);

  const isFullscreen = usePlayerStore(s => s.isFullscreen);

  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    if(paused === false) {
      setPlayerKeyId(p => p + 1);
    }
  }, [paused]);

  useEffect(() => {
    if(mode === "fullscreen") {
      videoRef.current?.presentFullscreenPlayer();
      Orientation.lockToLandscapeLeft();
      ImmersiveMode.setBarMode('FullSticky');
      ImmersiveMode.fullLayout(true);
    } else if(mode === "portrait") {
      videoRef.current?.dismissFullscreenPlayer();
      Orientation.lockToPortrait();
      ImmersiveMode.setBarMode('Normal');
      ImmersiveMode.fullLayout(false);
    }

  }, [mode]);

  useEffect(() => {
		const onAppStateChange = (state: AppStateStatus) => {
			if (state === 'active' && isFullscreen()) {
        ImmersiveMode.setBarMode('Normal');
        ImmersiveMode.fullLayout(false);
        setTimeout(() => {
          ImmersiveMode.setBarMode('FullSticky');
          ImmersiveMode.fullLayout(true);
        }, 0);
			}
		};

		const sub = AppState.addEventListener('change', onAppStateChange);
		return () => sub.remove();
	}, []);


  useEffect(() => {
    const dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => setScreenSize(screen));
    return () => dimensionSubscription?.remove();
  }, []);

  let videoWidth: DimensionValue | undefined = undefined;
  let videoHeight: DimensionValue | undefined = undefined;
  let topInset: DimensionValue | undefined = undefined;
  let bottomInset: DimensionValue | undefined = undefined;
  let leftInset: DimensionValue | undefined = undefined;
  let rightInset: DimensionValue | undefined = undefined;

  if(mode === "fullscreen") {
    videoWidth = screenSize.width;
    videoHeight = screenSize.height;
    leftInset = 0;
    topInset = 0;
    rightInset = 0;
    bottomInset = 0;
  } else if(mode === "portrait") {
    videoWidth = screenSize.width;
    videoHeight = (videoWidth * 9) / 16;
    leftInset = 0;
    topInset = insets.top;
    rightInset = undefined;
    bottomInset = undefined;
  } else if(mode === "mini-player") {
    videoWidth = 200;
    videoHeight = (videoWidth * 9) / 16;
    leftInset = undefined;
    topInset = undefined;
    rightInset = 30;
    bottomInset = 100;
  }

  if(mode === "hidden") {
    return null;
  }

  return (
    <View style={[
      styles.videoContainer,
      {
        width: videoWidth,
        height: videoHeight,
        top: topInset,
        bottom: bottomInset,
        left: leftInset,
        right: rightInset
      }
    ]}>
      <Video
        key={streamKey + playerKeyId}
        source={source ? { uri: source } : undefined}
        style={styles.video}
        resizeMode='contain'
        ignoreSilentSwitch='ignore'
        playInBackground={true}
        playWhenInactive={true}
        enterPictureInPictureOnLeave={true}
        disableFocus={true}
        paused={paused}
        muted={muted}
        onLoadStart={() => setLoadingVideo(true)}
        onLoad={() => setLoadingVideo(false)}
        onBuffer={(e: OnBufferData) => setLoadingVideo(e.isBuffering)}
      />
      <Overlay
        // isLoading={loadingVideo} // ??
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.background,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});