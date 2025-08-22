import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { StreamScreenProps } from '../types';


export default function StreamScreen({ navigation, route }: StreamScreenProps) {

  const { channel } = route.params;

  console.log(channel);

  useEffect(() => {
  }, []);

  

  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});