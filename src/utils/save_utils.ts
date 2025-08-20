import AsyncStorage from '@react-native-async-storage/async-storage';

const SecretKey = "secret";
const PassHash = "passHash";


const loadSecret = async (): Promise<any> => {
  return await load(SecretKey);
}

const saveSecret = async (secret: any): Promise<void> => {
  save(SecretKey, secret);
}

const loadPassHash = async (): Promise<any> => {
  return await load(PassHash);
}

const savePassHash = async (secret: any): Promise<void> => {
  save(PassHash, secret);
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
  loadSecret,
  saveSecret,
  loadPassHash,
  savePassHash
}