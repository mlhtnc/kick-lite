import AsyncStorage from '@react-native-async-storage/async-storage';

const Client = "client";
const Tokens = "tokens";
const Channels = "channels";
const SleepTime = "sleepTime";


export const loadClient = async (): Promise<any> => {
  return await load(Client);
}

export const saveClient = async (info: any): Promise<void> => {
  save(Client, info);
}

export const loadTokens = async (): Promise<any> => {
  return await load(Tokens);
}

export const saveTokens = async (tokens: any): Promise<void> => {
  save(Tokens, tokens);
}

export const loadChannels = async (): Promise<any> => {
  const channels = await load(Channels);
  if(channels) {
    return await load(Channels);
  } else {
    return [];
  }
}

export const saveChannels = async (channels: any): Promise<void> => {
  save(Channels, channels);
}

export const loadSleepTime = async (): Promise<any> => {
  return await load(SleepTime);
}

export const saveSleepTime = async (time: any): Promise<void> => {
  save(SleepTime, time);
}



const load = async (key: string): Promise<any> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch(err) {
    console.log('Error while loading', key);
    return null;
  }
}

const save = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch(err) {
    console.log('Error while saving', key, value);
  }
}

const clear = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch(err) {
    console.log('Error while clearing', key);
  }
}