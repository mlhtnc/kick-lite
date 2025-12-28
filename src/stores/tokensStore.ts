import { create } from 'zustand';

import { Tokens } from '../types';
import { showErrorRefreshingAccessToken } from '../alerts/alerts';
import { loadClient, saveTokens } from '../utils/save_utils';
import { refreshAccessToken } from '../services/kick_service';

interface TokensState {
  tokens: Tokens | null;
  expiresAt: number;
  setTokens: (tokens: Tokens) => void;
  setExpiresAt: (expiresIn: number) => void;
  tryRefreshAccessToken: () => Promise<boolean>;
}

export const useTokens = create<TokensState>((set, get): TokensState => ({
  tokens: null,
  expiresAt: 0,
  setTokens: (tokens: Tokens) => set({ tokens }),
  setExpiresAt: (expiresAt: number) => {
    set({ expiresAt });
  },
  tryRefreshAccessToken: async () => {
    if (Date.now() < get().expiresAt) {
      return true;
    }

    const client = await loadClient();
    const tokens = get().tokens;
    const refreshToken = tokens?.refreshToken;
    if (!client || !refreshToken) {
      return false;
    }
    
    try {
      const tokenResponse = await refreshAccessToken(client.clientId, client.clientSecret, refreshToken);
      const tokens = { accessToken: tokenResponse.access_token, refreshToken: tokenResponse.refresh_token };
      const expireAt = Date.now() + tokenResponse.expires_in * 1000;

      set({ tokens });
      get().setExpiresAt(expireAt);
      await saveTokens(tokens);
      return true;
    } catch(err) {
      showErrorRefreshingAccessToken();
      return false;
    }
  }
}));