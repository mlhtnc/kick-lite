import { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import { Colors } from '../constants';
import { StreamScreenProps } from '../types';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

export default function StreamScreen({ navigation, route }: StreamScreenProps) {

  const { channel } = route.params;


  useEffect(() => {
  }, []);
 

  return (
    <View style={styles.container}>
      <Video
				source={{ uri: '' }}
        style={styles.video}
        controls
			/>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#000',
		justifyContent: 'flex-start',
		alignItems: 'center',
  },
  video: {
		width: width,
		height: (width * 9) / 16, // 16:9 ratio
		backgroundColor: '#000',
	},
});