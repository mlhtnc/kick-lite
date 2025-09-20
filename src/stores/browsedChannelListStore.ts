import { create } from 'zustand';

import { Channel } from '../types';


interface ChannelListState {
	channels: Channel[];
  setChannels: (channels: Channel[]) => Promise<void>;
  addChannel: (channel: Channel) => Promise<void>;
  removeChannel: (channel: Channel) => Promise<void>;
}

export const useBrowsedChannelListStore = create<ChannelListState>((set) => ({
	channels: [],
  setChannels: async (channels: Channel[]) => {
    set({ channels });
  },
  addChannel: async (channel: Channel) => {
    set((state) => ({ channels: [...state.channels, channel] }));
  },
  removeChannel: async (channel: Channel) => {
    set((state) => ({ channels: state.channels.filter(ch => ch.id !== channel.id) }))
  }
}));