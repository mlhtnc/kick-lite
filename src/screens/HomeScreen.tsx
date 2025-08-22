import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { HomeScreenProps } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { getCurrentUser } from '../services/kick_service';


export default function HomeScreen({ navigation, route }: HomeScreenProps) {

  const { tokens } = route.params;

  useEffect(() => {
    getCurrentUser(tokens.accessToken)
    .then((res) => {
      console.log(res.data[0]);
    }).catch((err) => {
      console.log(err);
    });

  }, []);
  
  return (
    <View style={styles.container}>
      <ScreenHeader title={"Kick Lite"} hideEditButton={true} />
      
      <View style={styles.listContainer}>

     
      
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
    marginBottom: 70,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
});