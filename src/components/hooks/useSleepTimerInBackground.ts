import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

import { loadSleepTime } from "../../utils/save_utils";
import { isTimerRunning, startTimer, stopTimer } from "../../managers/timer_manager";
import ForegroundService from "../../modules/ForegroundService";
import { onSleepTimerExpired } from "../../helpers/sleep_timer_helper";


export default function useSleepTimerInBackground() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChanged);
    return () => subscription.remove();
  }, []);
  
  const onAppStateChanged = async (nextAppState: AppStateStatus) => {
    if(nextAppState === "background") {

      const sleepTime = await loadSleepTime();
      if(sleepTime && isTimerRunning()) {
        const remainingTime = stopTimer();
        ForegroundService.start(remainingTime);
      }

    } else if(nextAppState === "active") {

      const isServiceAlive = await ForegroundService.isAlive();
      if(isServiceAlive) {
        const remainingTime = await ForegroundService.getRemainingTime();
        startTimer(remainingTime, onSleepTimerExpired);
        ForegroundService.stop();
      }

    }
  }
}