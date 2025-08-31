import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView, VideoViewRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

import { Colors } from '../../constants';
import useOverrideBackPress from '../hooks/useOverrideBackPress';
import { PlayerProps } from '../../types';
import Overlay from './Overlay';


export default function Player({ streamURL, isFullscreen, isStreamReady, setIsFullscreen }: PlayerProps) {

  const videoViewRef =  React.useRef<VideoViewRef>(null);

  const [ paused, setPaused ] = useState(false);
  const [ loadingVideo, setLoadingVideo ] = useState<boolean>(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(Dimensions.get('screen'));


  const player = useVideoPlayer(streamURL, (_player) => {
    _player.onLoadStart = () => setLoadingVideo(true);
    _player.onLoad = () => setLoadingVideo(false);
    _player.onBuffer = (buffering: boolean) => setLoadingVideo(buffering);

    _player.playInBackground = true;
    _player.playWhenInactive = true;
    _player.ignoreSilentSwitchMode = 'ignore';

    _player.play();
  });

  useEffect(() => {
    const dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => setScreenSize(screen));
    return () => dimensionSubscription?.remove();
  }, []);

  useOverrideBackPress(useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
      return true;
    }
    return false;
  }, [isFullscreen]))


  const play = () => {
    player.play();
    setPaused(false);
  }

  const pause = () => {
    player.pause();
    setPaused(true);
  }

  const enterFullscreen = () => {
    videoViewRef.current?.enterFullscreen();
    Orientation.lockToLandscapeLeft();
    setIsFullscreen(true);
  }

  const exitFullscreen = () => {
    videoViewRef.current?.exitFullscreen();
    Orientation.lockToPortrait();
    setIsFullscreen(false);
  }

  const overlayActions = { play, pause, enterFullscreen, exitFullscreen };
  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;

  return (
    <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
      <VideoView
        ref={videoViewRef}
        style={styles.video}
        player={player}
        controls={false}
        autoEnterPictureInPicture={true}
        resizeMode='contain'
      />
      <Overlay
        actions={overlayActions}
        isStreamReady={isStreamReady}
        isLoading={loadingVideo}
        paused={paused}
        isFullscreen={isFullscreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  video: {
    width: '100%',
    height: '100%',
  },
});