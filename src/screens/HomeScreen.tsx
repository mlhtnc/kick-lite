import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants';
import { HomeScreenProps } from '../types';
import ScreenHeader from '../components/ScreenHeader';


export default function HomeScreen({ navigation, route }: HomeScreenProps) {




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
  plusButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.buttonPrimary,
  }
});