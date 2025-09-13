import { NativeModules } from "react-native";

const { ForegroundService } = NativeModules;

export default {
  start: (durationMs: number) => {
    ForegroundService.startService(durationMs);
  },
  stop: () => {
    ForegroundService.stopService();
  },
  killApp: () => {
    ForegroundService.killApp();
  }
};