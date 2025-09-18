import { NativeModules } from "react-native";

const { ForegroundService } = NativeModules;

export default {
  start: (durationMs: number) => {
    ForegroundService.startService(durationMs);
  },
  stop: () => {
    ForegroundService.stopService();
  },
  isAlive: async (): Promise<boolean> => {
    return await ForegroundService.isAlive();
  },
  getRemainingTime: async (): Promise<any> => {
    return await ForegroundService.getRemainingTime();
  },
  exitApp: () => {
    ForegroundService.exitApp();
  }
};