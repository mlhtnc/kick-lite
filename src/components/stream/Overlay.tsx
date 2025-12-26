import { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';

import { OverlayProps } from '../../types';
import { Colors } from '../../constants';
import BasicCircleButton from '../buttons/BasicCircleButton';
import { convertMillisecondsToTime } from '../../helpers/helpers';
import OverlayBottom from './OverlayBottom';
import OverlayQuality from './OverlayQuality';


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

  const onControllersPressed = () => {
    if(showControl) {
      clearTimeout(timeoutRef.current || undefined);
      stopShowingTime();
      setShowQualityMenu(false);
      setShowControl(false);
      fadeOut();
    } else {
      startShowingTime();
      setShowControl(true);
      fadeIn();

      clearTimeout(timeoutRef.current || undefined);
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

  const handleQualityChange = () => {
    stopShowingTime();
    setShowQualityMenu(false);
    setShowControl(false);
    fadeOut();
  }

  const playPauseButtonSize = isFullscreen ? 60 : 45;
  const playPauseIconName = paused ? "play-outline" : "pause-outline";
  const showIndicatorCondition = !isStreamReady;
  const showControlCondition = !showIndicatorCondition && isStreamReady;

  return (
    <TouchableOpacity style={styles.controlsContainer} onPress={onControllersPressed} activeOpacity={1}>
      { showControlCondition ?
      
        <Animated.View style={[ styles.controls, { opacity: fadeAnim, display: controlDisplayStyle } ]}>
          <BasicCircleButton
            style={[styles.playPauseButton, { width: playPauseButtonSize, height: playPauseButtonSize }]}
            iconName={playPauseIconName}
            iconSize={playPauseButtonSize * 0.6}
            onPress={togglePlayPause}
          />

          <OverlayBottom
            actions={actions}
            muted={muted}
            isFullscreen={isFullscreen}
            elapsedTime={elapsedTime}
            setShowQualityMenu={setShowQualityMenu}
          />

          <OverlayQuality
            actions={actions}
            streamURLs={streamURLs}
            isFullscreen={isFullscreen}
            selectedQuality={selectedQuality}
            showQualityMenu={showQualityMenu}
            handleQualityChange={handleQualityChange}
          />
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
    backgroundColor: "rgba(50,50,50,0.7)",
    borderRadius: 50,
  }
});