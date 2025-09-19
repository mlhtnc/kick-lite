import { create } from 'zustand';

import { Channel } from '../types';
import { saveChannels } from '../utils/save_utils';


interface ChannelListState {
	channels: Channel[];
  setChannels: (channels: Channel[]) => Promise<void>;
  addChannel: (channel: Channel) => Promise<void>;
  removeChannel: (channel: Channel) => Promise<void>;
}

export const useChannelListStore = create<ChannelListState>((set, get) => ({
	channels: [],
  setChannels: async (channels: Channel[]) => {
    set({ channels });
    await saveChannels(get().channels);
  },
  addChannel: async (channel: Channel) => {
    set((state) => ({ channels: [...state.channels, channel] }));
    await saveChannels(get().channels);
  },
  removeChannel: async (channel: Channel) => {
    set((state) => ({ channels: state.channels.filter(ch => ch.id !== channel.id) })),
    await saveChannels(get().channels);
  }
}));