import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../constants';
import { Channel, HomeScreenProps, Screens } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { getChannels, getUser } from '../services/kick_service';
import ChannelList from '../components/ChannelList';
import { showErrorChannelsLoading, showErrorUserLoading } from '../alerts/alerts';
import { loadChannels, loadSleepTime, saveChannels } from '../utils/save_utils';
import ForegroundService from '../modules/ForegroundService';
import { startTimer, stopTimer } from '../managers/timer_manager';


export default function HomeScreen({ navigation, route }: HomeScreenProps) {

  const { tokens } = route.params;

  const [ channels, setChannels ] = useState<Channel[]>();
  const [ loading, setLoading ] = useState<boolean>(false);


  useEffect(() => {
    initChannels();

    const subscription = AppState.addEventListener('change', onAppStateChanged);
    return () => subscription.remove();
  }, []);

  const onAppStateChanged = async (nextAppState: AppStateStatus) => {
    if(nextAppState === "background") {

      const sleepTime = await loadSleepTime();
      if(sleepTime === null) {
        ForegroundService.start(5 * 1000);
      } else {
        const remainingTime = stopTimer();
        ForegroundService.start(remainingTime);
      }

    } else if(nextAppState === "active") {

      const sleepTime = await loadSleepTime();
      if(sleepTime !== null) {
        const remainingTime = await ForegroundService.getRemainingTime();
        startTimer(remainingTime, onSleepTimerExpire);
      }

      ForegroundService.stop();
    }
  }

  const initChannels = async () => {
    const channels = await loadChannels();
    
    if(channels.length === 0) {
      return;
    }

    setLoading(true);
    getChannels(tokens.accessToken, channels.map((ch: Channel) => ch.slug))
    .then(async (channels) => {
      let updatedChannels = await fetchChannelUsernames(channels);
      sortChannels(updatedChannels);
      setChannels(updatedChannels);
    }).catch(() => {
      showErrorChannelsLoading();
    }).finally(() => {
      setLoading(false);
    });
  }

  const fetchChannelUsernames = async (channels: Channel[]) => {
    let error: boolean = false;

    const updatedChannels = await Promise.all(
      channels.map(async (ch) => {
        try {
          const user = await getUser(tokens.accessToken, ch.id);
          return { ...ch, name: user.name };
        } catch (err) {
          error = true;
          return ch;
        }
      })
    );

    if(error) {
      showErrorUserLoading();
    }

    return updatedChannels;
  }

  const sortChannels = (channels: Channel[]) => {
    return channels.sort((a, b) => {
      if (a.isLive !== b.isLive) {
        return a.isLive ? -1 : 1;
      }

      return b.viewerCount - a.viewerCount;
    });
  }

  const onChannelAdded = (): void => {
    initChannels();
  }

  const onChannelDelete = async (channel: Channel) => {
      const channels: Channel[] = await loadChannels();

      const updatedChannels = channels.filter((ch) => ch.id !== channel.id);

      await saveChannels([ ...updatedChannels ]);

      initChannels();
  }

  const onRefresh = () => {
    initChannels();
  }

  const onSearchButtonPressed = () => {
    navigation.navigate(Screens.Search, { tokens, onChannelAdded });
  }

  const onSleepTimerButtonPressed = () => {
    navigation.navigate(Screens.SleepTimer, { onExpire: onSleepTimerExpire });
  }

  const onSleepTimerExpire = () => {
    ForegroundService.killApp();
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={"Kick Lite"}
        onSearchButtonPressed={onSearchButtonPressed}
        onSleepTimerButtonPressed={onSleepTimerButtonPressed}
      />
      
        <View style={styles.listContainer}>
          <ChannelList
            channels={channels || []}
            tokens={tokens}
            navigation={navigation}
            loading={loading}
            onRefresh={onRefresh}
            onChannelDelete={onChannelDelete}
          />
        </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
});




