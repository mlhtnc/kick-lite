import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Dimensions, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView, VideoViewRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

import { Colors } from '../../constants';
import useOverrideBackPress from '../hooks/useOverrideBackPress';
import { PlayerProps, StreamURL } from '../../types';
import Overlay from './Overlay';


export default function Player({ streamURLs, startTime, isFullscreen, isStreamReady, setIsFullscreen }: PlayerProps) {

  const videoViewRef =  React.useRef<VideoViewRef>(null);

  const [ streamURL, setStreamURL ] = useState<string>("");
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

  useEffect(() => {
    if(streamURLs) {
      setStreamURL(streamURLs[0].url);
    }
  }, [streamURLs]);

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

  const onQualityChanged = (quality: StreamURL) => {
    setStreamURL(quality.url);
  }

  const overlayActions = { play, pause, enterFullscreen, exitFullscreen, onQualityChanged };
  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;

  return (
    <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
      <VideoView
        ref={videoViewRef}
        style={styles.video}
        player={player}
        controls={false}
        resizeMode='contain'
      />
      <Overlay
        actions={overlayActions}
        streamURLs={streamURLs}
        startTime={startTime}
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