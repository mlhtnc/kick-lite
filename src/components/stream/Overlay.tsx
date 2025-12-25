import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  View,
  Text,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { OverlayProps, StreamURL } from '../../types';
import { Colors } from '../../constants';
import BasicCircleButton from '../buttons/BasicCircleButton';
import { convertMillisecondsToTime } from '../../helpers/helpers';


export default function Overlay({
  actions,
  streamURLs,
  startTime,
  isStreamReady,
  paused,
  muted,
  isFullscreen,
  selectedQuality,
}: OverlayProps) {  
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const timerInterval = useRef<NodeJS.Timeout>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [ showControl, setShowControl ] = useState<boolean>(false);
  const [ showQualityMenu, setShowQualityMenu ] = useState<boolean>(false);
  const [ elapsedTime, setElapsedTime ] = useState<string>("");
  const [ controlDisplayStyle, setControlDisplayStyle ] = useState<"flex" | "none">("none");


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

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setControlDisplayStyle("flex");
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setControlDisplayStyle("none");
    });
  };

  const togglePlayPause = () => {
    if(paused) {
      actions.play();
    } else {
      actions.pause();
    }
  }

  const toggleVolume = () => {
    if(muted) {
      actions.unmute();
    } else {
      actions.mute();
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
      fadeOut();
    } else {
      startShowingTime();
      setShowControl(true);
      fadeIn();

      if(timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        stopShowingTime();
        setShowQualityMenu(false);
        setShowControl(false);
        fadeOut();
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
    stopShowingTime();
    setShowQualityMenu(false);
    setShowControl(false);
    fadeOut();
  }

  const selectedQualityHeight = selectedQuality ? selectedQuality.height : 1080;
  const playPauseIconName = paused ? "play-outline" : "pause-outline";
  const volumeIconName = muted ? "volume-mute-outline" : "volume-medium-outline";
  const showIndicatorCondition = !isStreamReady;
  const showQualityCondition = showQualityMenu && streamURLs;
  const showControlCondition = !showIndicatorCondition && isStreamReady;

  return (
    <TouchableOpacity style={styles.controlsContainer} onPress={onControllersPressed} activeOpacity={1}>
      { showControlCondition ?
      
        <Animated.View style={[ styles.controls, { opacity: fadeAnim, display: controlDisplayStyle } ]}>
          <BasicCircleButton style={styles.playPauseButton} iconName={playPauseIconName} iconSize={40} onPress={togglePlayPause}/>

          <LinearGradient style={[styles.bottomControls, isFullscreen ? { height: "9%" } : undefined]} colors={['#0000', '#000a']}>
            <View style={styles.bottomControlsContent}>
              <Text style={styles.timeText}>{elapsedTime}</Text>
              <View style={styles.bottomRightControls}>
                <BasicCircleButton style={styles.qualityButton} iconName={volumeIconName} iconSize={25} onPress={toggleVolume} />
                <BasicCircleButton style={styles.qualityButton} iconName='settings-outline' iconSize={25} onPress={toggleQualityOptions} />
                <BasicCircleButton style={styles.fullscreenButton} iconName='scan-outline' iconSize={25} onPress={toggleFullscreen} />
              </View>
            </View>
          </LinearGradient>
          
          { showQualityCondition ?
            (
              <View style={styles.qualityMenu}>
                {streamURLs.map(q => {
                  let textColor = "#fff";
                  if(q.height === selectedQualityHeight) {
                    textColor = Colors.textAccent;
                  }

                  return (<TouchableOpacity key={q.height} onPress={() => selectQuality(q)} style={styles.qualityOption} activeOpacity={0.7}>
                            <Text style={{color: textColor, fontWeight: "bold"}}>{q.height + "p"}</Text>
                          </TouchableOpacity>)
                })}
              </View>
            ) : null
          }
        </Animated.View>
        : null
      }

      { showIndicatorCondition ? <ActivityIndicator size={'large'} color={Colors.success} /> : null }

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
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
  controls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
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
    height: "13%"
  },
  bottomControlsContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomRightControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center', 
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