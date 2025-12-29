import { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';

import { Colors } from '../../constants';
import BasicCircleButton from '../buttons/BasicCircleButton';
import { convertMillisecondsToTime } from '../../helpers/helpers';
import OverlayBottom from './OverlayBottom';
import OverlayQuality from './OverlayQuality';
import { usePlayerStore } from '../../stores/playerStore';
import { usePlayerIntent } from '../../stores/playerIntentStore';

export default function Overlay() {  
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const timerInterval = useRef<NodeJS.Timeout>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [ showControl, setShowControl ] = useState<boolean>(false);
  const [ showQualityMenu, setShowQualityMenu ] = useState<boolean>(false);
  const [ elapsedTime, setElapsedTime ] = useState<string>("");
  const [ controlDisplayStyle, setControlDisplayStyle ] = useState<"flex" | "none">("none");

  const mode = usePlayerStore(s => s.mode);
  const paused = usePlayerStore(s => s.paused);
  const startTime = usePlayerStore(s => s.startTime);

  const setMode = usePlayerStore(s => s.setMode);
  const setPaused = usePlayerStore(s => s.setPaused);
  const isFullscreen = usePlayerStore(s => s.isFullscreen);
  const isStreamReady = usePlayerStore(s => s.isStreamReady);

  const requestOpenStream = usePlayerIntent(s => s.requestOpenStream);
  const requestCloseStream = usePlayerIntent(s => s.requestCloseStream);


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
    setPaused(!paused);
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

  const onMiniPlayerInteracted = () => {
    requestOpenStream();
  }

  const onMiniPlayerClosePressed = () => {
    requestCloseStream();
  }

  const playPauseButtonSize = isFullscreen() ? 60 : 45;
  const playPauseIconName = paused ? "play-outline" : "pause-outline";
  const showIndicatorCondition = !isStreamReady();
  const showControlCondition = !showIndicatorCondition && isStreamReady();

  if(mode === "mini-player") {
    return (<>
    <Pressable
      style={{position: "absolute", right: 0, top: 0, left: 0, bottom: 0}}
      onPress={onMiniPlayerInteracted}
    />
    <BasicCircleButton
      style={{position: "absolute", right: 0, top: 0, backgroundColor: "#fff0"}}
      iconName='close-outline'
      iconSize={24}
      onPress={onMiniPlayerClosePressed}
    />
    </>)
  }
  
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
            elapsedTime={elapsedTime}
            setShowQualityMenu={setShowQualityMenu}
          />

          <OverlayQuality
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