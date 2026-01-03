import { create } from "zustand";

import { Channel, StreamURL } from "../types"

type CurrentStreamState = {
  currentChannel?: Channel;
	streamUrls?: StreamURL[];
  selectedQuality?: number;
  setCurrentChannel: (currentChannel: Channel) => void;
  setStreamUrls: (urls?: StreamURL[]) => void;
  setSelectedQuality: (quality?: number) => void;
  isStreamReady: () => boolean;
}

export const useCurrentStreamStore = create<CurrentStreamState>((set, get) => ({
  currentChannel: undefined,
  setCurrentChannel: (currentChannel: Channel) => set({ currentChannel }),
  setStreamUrls: streamUrls => set({ streamUrls }),
  setSelectedQuality: quality => set({ selectedQuality: quality }),
  isStreamReady: () => get().streamUrls ? true : false
}));