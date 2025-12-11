import { create } from 'zustand';


interface BackgroundServiceInfo {
  isRunning: boolean;
  endTimeMs: number;
  setEndTime: (endTimeMs: number) => void;
  setIsRunning: (isRunning: boolean) => void;
}

export const useBackgroundServiceInfo = create<BackgroundServiceInfo>((set) => ({
  isRunning: false,
  endTimeMs: -1,
  setEndTime: (endTimeMs: number) => set({ endTimeMs }),
  setIsRunning: (isRunning: boolean) => set({ isRunning }),
}));