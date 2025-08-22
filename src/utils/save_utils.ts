import AsyncStorage from '@react-native-async-storage/async-storage';

const Client = "client";
const Tokens = "tokens";


const loadClient = async (): Promise<any> => {
  return await load(Client);
}

const saveClient = async (info: any): Promise<void> => {
  save(Client, info);
}

const loadTokens = async (): Promise<any> => {
  return await load(Tokens);
}

const saveTokens = async (tokens: any): Promise<void> => {
  save(Tokens, tokens);
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




export {
  loadClient,
  saveClient,
  loadTokens,
  saveTokens,
}