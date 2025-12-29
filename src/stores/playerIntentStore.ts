import { create } from "zustand";

type PlayerIntent =
	| "NONE"
	| "REQUEST_OPEN_STREAM"
	| "REQUEST_CLOSE_STREAM";

type PlayerState = {
	intent: PlayerIntent;
	requestOpenStream: () => void;
  requestCloseStream: () => void,
	clearIntent: () => void;
};

export const usePlayerIntent = create<PlayerState>((set): PlayerState => ({
  intent: "NONE",
  requestOpenStream: () => set({ intent: "REQUEST_OPEN_STREAM"}),
  requestCloseStream: () => set({ intent: "REQUEST_CLOSE_STREAM"}),
  clearIntent: () => set({ intent: "NONE"})
}));
