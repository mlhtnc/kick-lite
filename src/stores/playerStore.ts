import { create } from 'zustand';

import { PlayerMode } from "../components/stream/Player";

type PlayerState = {
  streamKey: string;
  source: string;
	mode: PlayerMode;
  muted: boolean;
  paused: boolean;
  startTime: string;

  setStreamKey: (streamKey: string) => void;
  setSource: (source: string) => void;
	setMode: (mode: PlayerMode) => void;
  setMuted: (muted: boolean) => void;
  setPaused: (paused: boolean) => void;
  setStartTime: (startTime: string) => void;
  isFullscreen: () => boolean;
};

export const usePlayerStore = create<PlayerState>((set, get): PlayerState => ({
  streamKey: "",
  source: "",
	mode: "hidden",
  muted: false,
  paused: false,
  startTime: "",

  setStreamKey: streamKey => set({ streamKey }),
  setSource: source => set({ source }),
	setMode: mode => set({ mode }),
  setMuted: muted => set({ muted }),
  setPaused: paused => set({ paused }),
  setStartTime: (startTime: string) => set({ startTime }),
  isFullscreen: () => get().mode === "fullscreen",
}));
