import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { OverlayProps, StreamURL } from '../../types';
import { Colors } from '../../constants';
import BasicCircleButton from '../buttons/BasicCircleButton';
import { convertMillisecondsToTime } from '../../helpers/helpers';


export default function Overlay({actions, streamURLs, startTime, isStreamReady, isLoading, paused, isFullscreen}: OverlayProps) {
  
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const timerInterval = useRef<NodeJS.Timeout>(null);

  const [ showControl, setShowControl ] = useState<boolean>(false);
  const [ showQualityMenu, setShowQualityMenu ] = useState<boolean>(false);
  const [ elapsedTime, setElapsedTime ] = useState<string>("");


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
      stopShowingTime();
      setShowControl(false);
    } else {
      startShowingTime();
      setShowControl(true);

      if(timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        stopShowingTime();
        setShowControl(false);
      }, 3000);
    }
  }

  const startShowingTime = () => {
    const diffMs = new Date().getTime() - new Date(startTime).getTime();
    setElapsedTime(convertMillisecondsToTime(diffMs));

    timerInterval.current = setInterval(() => {
      const diffMs = new Date().getTime() - new Date(startTime).getTime();
      setElapsedTime(convertMillisecondsToTime(diffMs));
    }, 500);
  }

  const stopShowingTime = () => {
    clearInterval(timerInterval.current || undefined);
  }

  const showQualityOptions = () => {
    setShowQualityMenu(true);
    clearTimeout(timeoutRef.current || undefined);
  }

  const selectQuality = (quality: StreamURL) => {
    actions.onQualityChanged(quality);
    setShowQualityMenu(false);
    setShowControl(false);
  }

  
  const playPauseIconName = paused ? "play-outline" : "pause-outline";

  return (
    <TouchableOpacity style={styles.controls} onPress={onControllersPressed} activeOpacity={1}>
      { (isStreamReady && showControl) ?
        <>

          <BasicCircleButton style={styles.playPauseButton} iconName={playPauseIconName} iconSize={40} onPress={togglePlayPause}/>
          <BasicCircleButton style={styles.fullscreenButton} iconName='scan-outline' iconSize={25} onPress={toggleFullscreen} />
          
          
          { !showQualityMenu || !streamURLs ? (
            <BasicCircleButton style={styles.qualityButton} iconName='settings-outline' iconSize={25} onPress={showQualityOptions} />
          ) : (
            <View style={styles.qualityMenu}>
              {streamURLs.map(q => (
                <TouchableOpacity key={q.height} onPress={() => selectQuality(q)} style={styles.qualityOption}>
                  <Text style={{color:"white"}}>{q.height + "p"}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.timeText}>{elapsedTime}</Text>

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
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0)",
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
    width: 25,
    height: 25
  },
  qualityButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
    width: 25,
    height: 25
  },
  qualityMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 5,
    padding: 5,
  },
  qualityOption: {
    padding: 5,
  },
  timeText: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    margin: 5,
    fontSize: 16,
    color: "#fff"
  },
});