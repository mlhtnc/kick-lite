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
import LinearGradient from 'react-native-linear-gradient';


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
      setShowQualityMenu(false);
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
      }, 5000);
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

  const toggleQualityOptions = () => {
    if(showQualityMenu) {
      clearTimeout(timeoutRef.current || undefined);
    }

    setShowQualityMenu(p => !p);
  }

  const selectQuality = (quality: StreamURL) => {
    actions.onQualityChanged(quality);
    setShowQualityMenu(false);
    setShowControl(false);
  }

  
  const playPauseIconName = paused ? "play-outline" : "pause-outline";
  const showIndicatorCondition = !isStreamReady || isLoading;
  const showQualityCondition = showQualityMenu && streamURLs;
  const showControlCondition = !showIndicatorCondition && isStreamReady && showControl;

  return (
    <TouchableOpacity style={styles.controls} onPress={onControllersPressed} activeOpacity={1}>
      { showControlCondition ?
      
        <>
          <BasicCircleButton style={styles.playPauseButton} iconName={playPauseIconName} iconSize={40} onPress={togglePlayPause}/>

          <LinearGradient style={styles.bottomControls} colors={['#0000', '#000a',]}>
            <View style={styles.bottomControlsContent}>
              <Text style={styles.timeText}>{elapsedTime}</Text>
              <View style={styles.bottomRightControls}>
                <BasicCircleButton style={styles.qualityButton} iconName='settings-outline' iconSize={25} onPress={toggleQualityOptions} />
                <BasicCircleButton style={styles.fullscreenButton} iconName='scan-outline' iconSize={25} onPress={toggleFullscreen} />
              </View>
            </View>
          </LinearGradient>
          
          { showQualityCondition ?
            (
              <View style={styles.qualityMenu}>
                {streamURLs.map(q => (
                  <TouchableOpacity key={q.height} onPress={() => selectQuality(q)} style={styles.qualityOption}>
                    <Text style={{color:"#fff"}}>{q.height + "p"}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          }
        </>
        : null
      }

      { showIndicatorCondition ? <ActivityIndicator size={'large'} color={Colors.success} /> : null }

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
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: "15%"
  },
  bottomControlsContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomRightControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    width: 80
  },
  fullscreenButton: {
    marginHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0)",
    width: 25,
    height: 25
  },
  qualityButton: {
    marginHorizontal: 5,
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
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fff",
  },
});