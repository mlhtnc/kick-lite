import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { OverlayProps } from '../../types';
import { Colors } from '../../constants';
import BasicCircleButton from '../buttons/BasicCircleButton';


export default function Overlay({actions, isStreamReady, isLoading, paused, isFullscreen}: OverlayProps) {
  
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [ showControl, setShowControl ] = useState<boolean>(false);
  

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
    if(paused) {
      actions.play();
    } else {
      actions.pause();
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      actions.exitFullscreen();
    } else {
      actions.enterFullscreen();
    }
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