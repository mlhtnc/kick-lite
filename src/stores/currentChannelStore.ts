import { create } from "zustand";

import { Channel } from "../types"

type CurrentChannelState = {
  currentChannel?: Channel;
  setCurrentChannel: (currentChannel: Channel) => void;
}

export const useCurrentChannel = create<CurrentChannelState>((set) => ({
  currentChannel: undefined,
  setCurrentChannel: (currentChannel: Channel) => set({ currentChannel })
}));