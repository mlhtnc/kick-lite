import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import Video, { OnBufferData, VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

import { Colors } from '../../constants';
import useOverrideBackPress from '../hooks/useOverrideBackPress';
import { PlayerProps, StreamURL } from '../../types';
import Overlay from './Overlay';


export default function Player({ streamURLs, startTime, selectedQuality, isFullscreen, isStreamReady, setIsFullscreen, setSelectedQuality }: PlayerProps) {

  const videoRef = useRef<VideoRef>(null);

  const [ streamURL, setStreamURL ] = useState<string>("");
  const [ paused, setPaused ] = useState(false);
  const [ loadingVideo, setLoadingVideo ] = useState<boolean>(false);
  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(Dimensions.get('screen'));


  useEffect(() => {
    const dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => setScreenSize(screen));
    return () => dimensionSubscription?.remove();
  }, []);

  useEffect(() => {
    if(selectedQuality) {
      setStreamURL(selectedQuality.url);
    } else if(streamURLs) {
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
    setPaused(false);
  }

  const pause = () => {
    setPaused(true);
  }

  const enterFullscreen = () => {
    videoRef.current?.presentFullscreenPlayer();
    Orientation.lockToLandscapeLeft();
    StatusBar.setHidden(true);
    setIsFullscreen(true);
  }

  const exitFullscreen = () => {
    videoRef.current?.dismissFullscreenPlayer();
    Orientation.lockToPortrait();
    StatusBar.setHidden(false);
    setIsFullscreen(false);
  }

  const onQualityChanged = (quality: StreamURL) => {
    setStreamURL(quality.url);
    setSelectedQuality(quality);
  }

  const overlayActions = { play, pause, enterFullscreen, exitFullscreen, onQualityChanged };
  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen ? screenSize.height : (videoWidth * 9) / 16;

  return (
    <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
      <Video
        source={{ uri: streamURL }}
        style={styles.video}
        resizeMode='contain'
        playInBackground={true}
        playWhenInactive={true}
        enterPictureInPictureOnLeave={true}
        paused={paused}
        onLoadStart={() => setLoadingVideo(true)}
        onLoad={() => setLoadingVideo(false)}
        onBuffer={(e: OnBufferData) => setLoadingVideo(e.isBuffering)}
        ignoreSilentSwitch='ignore'
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