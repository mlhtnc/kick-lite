import { create } from 'zustand';

import { PlayerMode } from "../components/stream/Player";
import { StreamURL } from "../types";

type PlayerState = {
  streamKey: string;
  source: string;
	mode: PlayerMode;
  muted: boolean;
  paused: boolean;
	streamUrls?: StreamURL[];
  startTime: string;
  selectedQuality?: StreamURL;

  setStreamKey: (streamKey: string) => void;
  setSource: (source: string) => void;
	setMode: (mode: PlayerMode) => void;
  setMuted: (muted: boolean) => void;
  setPaused: (paused: boolean) => void;
	setStreamUrls: (urls?: StreamURL[]) => void;
  setSelectedQuality: (quality?: StreamURL) => void;
  setStartTime: (startTime: string) => void;

  isFullscreen: () => boolean;
  isStreamReady: () => boolean;
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
	setStreamUrls: streamUrls => set({ streamUrls }),
  setSelectedQuality: quality => set({ selectedQuality: quality }),
  setStartTime: (startTime: string) => set({ startTime }),

  isFullscreen: () => get().mode === "fullscreen",
  isStreamReady: () => get().streamUrls ? true : false
}));
