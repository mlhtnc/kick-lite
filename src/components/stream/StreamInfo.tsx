import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants';
import { StreamInfoProps } from '../../types';
import { formatViewerCount } from '../../helpers/helpers';
import { getChannels } from '../../services/kick_service';


export default function StreamInfo({ channel }: StreamInfoProps) {

  const [ viewerCount, setViewerCount ] = useState<number>(channel.viewerCount);


  useEffect(() => {
		const interval = setInterval(async () => {
			try {
        
        getChannels([ channel.slug ])
        .then(async (channels) => {
          setViewerCount(channels[0].viewerCount);
        }).catch(() => {});
				
			} catch (e) {}
		}, 60000);

		return () => clearInterval(interval);
	}, [channel.id]);


  const viewerCountFormatted = formatViewerCount(viewerCount);
  
  return (
    <View style={styles.container}>
      <View style={styles.textContainer1}>
        <Text style={styles.nameText}>{channel.name}</Text>
        <Text style={styles.viewerCountText}>{channel.viewerCount > 0 ? viewerCountFormatted : ""}</Text>
      </View>

      <View style={styles.textContainer2}>
        <Text style={styles.streamTitleText}>{channel.streamTitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginTop: 10
  },
  textContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "stretch",
    marginBottom: 10
  },
  textContainer2: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  nameText: {
    flex: 5,
    color: Colors.textPrimary,
    fontSize: 18,
  },
  streamTitleText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  viewerCountText: {
    flex: 1,
    fontWeight: "bold",
    color: Colors.textAccent,
    fontSize: 16,
    textAlign: "right"
  },
});