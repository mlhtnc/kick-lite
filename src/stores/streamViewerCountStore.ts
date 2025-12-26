import { create } from 'zustand';

type StreamInfoStore = {
	viewerCount: number;
	streamTitle: string;
  setViewerCount: (n: number) => void;
  setStreamTitle: (title: string) => void;
};

export const useStreamInfoStore = create<StreamInfoStore>((set) => ({
	viewerCount: 0,
  streamTitle: "",
	setViewerCount: (n) => set({ viewerCount: n }),
  setStreamTitle: (title) => set({ streamTitle: title }),
}));
