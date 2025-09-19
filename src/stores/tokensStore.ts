import { create } from 'zustand';

import { Tokens } from '../types';


interface TokensState {
  tokens: Tokens | null;
  setTokens: (tokens: Tokens) => void;
}

export const useTokens = create<TokensState>((set) => ({
  tokens: null,
  setTokens: (tokens: Tokens) => set({ tokens })
}));