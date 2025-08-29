import { StyleSheet } from 'react-native';
import Video, { OnBufferData } from 'react-native-video';

import { StreamPlayerProps } from '../types';


export default function StreamPlayer({ streamURL, paused, setLoadingVideo }: StreamPlayerProps) {

  if(streamURL === "") {
    return null;
  }

  return (
    <Video
      source={{ uri: streamURL }}
      style={styles.video}
      resizeMode='contain'
      playInBackground={true}
      playWhenInactive={true}
      paused={paused}
      onLoadStart={() => setLoadingVideo(true)}
      onLoad={() => setLoadingVideo(false)}
      onBuffer={(e: OnBufferData) => setLoadingVideo(e.isBuffering)}
      ignoreSilentSwitch='ignore'
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});