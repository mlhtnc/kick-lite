import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Dimensions, StyleSheet, View } from 'react-native';
import Video, { OnBufferData, VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import ImmersiveMode from 'react-native-immersive-mode';

import Overlay from './Overlay';
import { usePlayerStore } from '../../stores/playerStore';
import { Colors } from '../../constants';

export type PlayerMode =
  "hidden" |
  "mini-player" |
  "portrait" |
  "fullscreen";

export default function Player() {

  const videoRef = useRef<VideoRef>(null);

  const [ playerKey, setPlayerKey ] = useState<number>(0); // Used to force re-mount Video component
  const [ loadingVideo, setLoadingVideo ] = useState<boolean>(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(Dimensions.get('screen'));

  const source = usePlayerStore(s => s.source);
  const mode = usePlayerStore(s => s.mode);
  const muted = usePlayerStore(s => s.muted);
  const paused = usePlayerStore(s => s.paused);

  const isFullscreen = usePlayerStore(s => s.isFullscreen);

  useEffect(() => {
    if(paused === false) {
      setPlayerKey(p => p + 1);
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


  // This is job of StreamScreen
  // useOverrideBackPress(useCallback(() => {
  //   if (isFullscreen()) {
  //     exitFullscreen();
  //     return true;
  //   }
  //   return false;
  // }, [isFullscreen()]));


  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen() ? screenSize.height : (videoWidth * 9) / 16;

  if(mode === "hidden") {
    return null;
  }

  return (
    <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
      <Video
        key={playerKey}
        source={{ uri: source }}
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