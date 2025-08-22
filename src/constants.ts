import { ColorsType } from "./types";

export const KickApiBaseUrl = "https://api.kick.com/public/v1";
export const KickAuthBaseUrl = "https://id.kick.com/oauth/authorize";
export const KickAuthTokenBaseUrl = "https://id.kick.com/oauth/token";
export const KickScopeString = "chat:read chat:write user:read user:edit channel:read channel:edit";
export const KickRedirectUri = "http://localhost:3000/callback";

export const LoginScreenName = "LoginScreen";
export const HomeScreenName = "HomeScreen";

export const Colors: ColorsType = {
	background: "#121212",
	textPrimary: "#FFFFFF",
	textSecondary: "#AAAAAA",
	buttonPrimary: "#007A3D",
	success: "#4CAF50",
	error: "#F44336",
	border: "#333333",
};
