import { useCallback } from 'react';
import {
  StyleSheet,
  BackHandler,
  View,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../../constants';
import BasicCircleButton from '../buttons/BasicCircleButton';
import { formatViewerCount } from '../../helpers/helpers';
import { useStreamInfoStore } from '../../stores/streamViewerCountStore';
import { OverlayBottomProps } from '../../types';


export default function OverlayBottom({
  actions,
  muted,
  isFullscreen,
  elapsedTime,
  setShowQualityMenu
}: OverlayBottomProps) {  

  const viewerCount = useStreamInfoStore((s) => s.viewerCount);

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

  const toggleQualityOptions = () => {
    setShowQualityMenu(p => !p);
  }

  const buttonSize = isFullscreen ? 30 : 25;
  const elapsedTimeTextSize = isFullscreen ? 18 : 16;
  const bottomControlsHeight = isFullscreen ? 50 : 30;
  const volumeIconName = muted ? "volume-mute-outline" : "volume-medium-outline";
  const viewerCountFormatted = formatViewerCount(viewerCount);

  return (
    <LinearGradient style={[styles.bottomControls, { height: bottomControlsHeight }]} colors={['#0000', '#000a']}>
      <View style={styles.bottomControlsContent}>
        <View style={styles.textGroup}>
          <Text style={[styles.timeText, { fontSize: elapsedTimeTextSize }]}>{elapsedTime}</Text>
          <Text style={[styles.dotText, { fontSize: elapsedTimeTextSize, display: isFullscreen ? "flex" : "none" }]}>{"•" }</Text>
          <Text style={[styles.viewerCountText, { fontSize: elapsedTimeTextSize, display: isFullscreen ? "flex" : "none" }]}>{viewerCountFormatted}</Text>
        </View>
        <View style={styles.bottomRightControls}>
          <BasicCircleButton
            style={[styles.button, isFullscreen ? { width: 30, height: 30 } : undefined]}
            iconName={volumeIconName}
            iconSize={buttonSize}
            onPress={toggleVolume}
          />
          <BasicCircleButton
            style={[styles.button, isFullscreen ? { width: 30, height: 30 } : undefined]}
            iconName='settings-outline'
            iconSize={buttonSize}
            onPress={toggleQualityOptions}
          />
          <BasicCircleButton
            style={[styles.button, isFullscreen ? { width: 30, height: 30 } : undefined]}
            iconName='scan-outline'
            iconSize={buttonSize}
            onPress={toggleFullscreen}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomControlsContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRightControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },
  button: {
    marginHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0)",
    width: 25,
    height: 25
  },
  textGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  timeText: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fff",
  },
  dotText: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textAccent,
  },
  viewerCountText: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textAccent,
  }
});