import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BootSplash from "react-native-bootsplash";

import { mainToastConfig } from './src/toast_types/toast_types';
import { Colors } from './src/constants';
import RootStack from './src/navigations/RootStack';
import Player from './src/components/stream/Player';

export default function App() {

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <StatusBar
        translucent={false}
        backgroundColor={"transparent"}
        barStyle="light-content"
      />

      <NavigationContainer onReady={() => BootSplash.hide() } >
        <RootStack />
      </NavigationContainer>

      <Player />
      <Toast config={mainToastConfig} visibilityTime={3000} swipeable />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    backgroundColor: Colors.background
  }
});