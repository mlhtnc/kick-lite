import { create, StateCreator } from 'zustand';

import { Channel } from '../types';
import { loadChannels, saveChannels } from '../utils/save_utils';
import { getChannels, getUser } from '../services/kick_service';
import { showErrorChannelsLoading, showErrorUserLoading } from '../alerts/alerts';


interface ChannelListState {
	channels: Channel[];
  setChannels: (channels: Channel[]) => Promise<void>;
  addChannel: (channel: Channel) => Promise<void>;
  removeChannel: (channel: Channel) => Promise<void>;
  fetchChannels: () => void;
  channelsLoading: boolean;
}

type SetFn = Parameters<StateCreator<ChannelListState>>[0];
type GetFn = Parameters<StateCreator<ChannelListState>>[1];


const fetchChannels = async (set: SetFn, channels: Channel[]) => {
  let channelSlugs = [];
  if(channels.length === 0) {
    const savedChannels = await loadChannels();
    if(savedChannels.length === 0) {
      return;
    }

    channelSlugs = savedChannels;
  } else {
    channelSlugs = channels.map((ch: Channel) => ch.slug);
  }

  let updatedChannels: Channel[] = [];

  set({ channelsLoading: true });
  getChannels(channelSlugs)
  .then(async (channels) => {
    updatedChannels = await fetchChannelUsernames(channels);
    sortChannels(updatedChannels);
  }).catch(() => {
    showErrorChannelsLoading();
  }).finally(() => {
    set({ channelsLoading: false, channels: updatedChannels});
  });
}

const fetchChannelUsernames = async (channels: Channel[]) => {
  let error: boolean = false;

  const updatedChannels = await Promise.all(
    channels.map(async (ch) => {
      try {
        const user = await getUser(ch.id);
        return { ...ch, name: user.name };
      } catch (err) {
        error = true;
        return ch;
      }
    })
  );

  if(error) {
    showErrorUserLoading();
  }

  return updatedChannels;
}

const sortChannels = (channels: Channel[]) => {
  return channels.sort((a, b) => {
    if (a.isLive !== b.isLive) {
      return a.isLive ? -1 : 1;
    }

    return b.viewerCount - a.viewerCount;
  });
}

const fetch = (set: SetFn, get: GetFn) => {
  fetchChannels(set, get().channels);
}

const saveChannelsBySlugs = async (channels: Channel[]) => {
  const slugs = channels.map((ch) => ch.slug);
  await saveChannels(slugs);
}


export const useChannelListStore = create<ChannelListState>((set, get) => ({
	channels: [],
  setChannels: async (channels: Channel[]) => {
    fetchChannels(set, channels);
    await saveChannelsBySlugs(get().channels);
  },
  addChannel: async (channel: Channel) => {
    let { channels } = get();
    channels = [...channels, channel];
    fetchChannels(set, channels);

    await saveChannelsBySlugs(channels);
  },
  removeChannel: async (channel: Channel) => {
    let { channels } = get();
    channels = channels.filter(ch => ch.id !== channel.id);
    set({ channels });

    await saveChannelsBySlugs(channels);
  },
  fetchChannels: () => fetch(set, get),
  channelsLoading: false,
}));