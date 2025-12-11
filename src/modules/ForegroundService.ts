import { NativeModules } from "react-native";

const { ForegroundService } = NativeModules;

export default {
  start: () => {
    ForegroundService.startService();
  },
  stop: () => {
    ForegroundService.stopService();
  },
  updateTimer: (endTimeMs: number) => {
    ForegroundService.updateTimer(endTimeMs);
  },
  stopTimer: () => {
    ForegroundService.stopTimer();
  }
};