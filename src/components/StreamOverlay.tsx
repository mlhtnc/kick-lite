import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { Immersive } from 'react-native-immersive';

import { StreamOverlayHandles, StreamOverlayProps } from '../types';
import { Colors } from '../constants';
import BasicCircleButton from '../components/buttons/BasicCircleButton';


function StreamOverlay(props: StreamOverlayProps, ref: ForwardedRef<StreamOverlayHandles>) {
  
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [ showControl, setShowControl ] = useState<boolean>(false);

  const { isStreamReady, isLoading, paused, isFullscreen, setPaused, setIsFullscreen }: StreamOverlayProps = props;

  
  useImperativeHandle(ref, () =>({
    toggleFullscreen
  }))

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isFullscreen) {
          toggleFullscreen();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isFullscreen])
  );

  const togglePlayPause = () => {
    setPaused(!paused);
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      Immersive.off();
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    } else {
      Immersive.on();
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
    }
    setIsFullscreen((prevIsFullscreen) => !prevIsFullscreen);
  }

  const onControllersPressed = () => {
    if(showControl) {
      setShowControl(false);
    } else {
      setShowControl(true);

      if(timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setShowControl(false);
      }, 3000);
    }
  }

  
  const playPauseIconName = paused ? "play-outline" : "pause-outline";


  return (
    <TouchableOpacity style={styles.controls} onPress={onControllersPressed} activeOpacity={1}>
      { (isStreamReady && showControl) ?
        <>
          <BasicCircleButton style={styles.playPauseButton} iconName={playPauseIconName} iconSize={40} onPress={togglePlayPause} />
          <BasicCircleButton style={styles.fullscreenButton} iconName='expand-outline' iconSize={30} onPress={toggleFullscreen} />
        </>
        : null
      }

      { (!isStreamReady || isLoading) ? <ActivityIndicator size={'large'} color={Colors.success} /> : null }

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0)"
  },
  playPauseButton: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
    width: 30,
    height: 30
  },
});


export default forwardRef(StreamOverlay);