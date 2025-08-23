import { ColorsType } from "./types";

export const KickApiBaseUrl = "https://api.kick.com/public/v1";
export const KickAuthBaseUrl = "https://id.kick.com/oauth/authorize";
export const KickAuthTokenBaseUrl = "https://id.kick.com/oauth/token";
export const KickScopeString = "chat:read chat:write user:read user:edit channel:read channel:edit";
export const KickRedirectUri = "http://localhost:3000/callback";



export const Colors: ColorsType = {
	background: "#121212",
	textPrimary: "#FFFFFF",
	textSecondary: "#AAAAAA",
	textAccent: "#53FC18",
	buttonPrimary: "#007A3D",
	card: "#222222",
	success: "#4CAF50",
	error: "#F44336",
	border: "#333333",
};
