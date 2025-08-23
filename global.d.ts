declare module 'react-native-base64' {
  const base64: {
    encode(input: string): string;
    decode(input: string): string;
    encodeFromByteArray(input: Uint8Array): string;
  };
  export default base64;
}

interface Crypto {
    getRandomValues<T extends ArrayBufferView>(array: T): T;
}

declare var crypto: Crypto;

declare module '@env' {
  export const API_HOST: string;
}