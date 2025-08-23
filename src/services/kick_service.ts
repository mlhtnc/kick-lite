import { KickApiBaseUrl, KickAuthTokenBaseUrl } from "../constants";
import { Channel, User } from "../types";


export const getToken = async (
	clientId: string,
	clientSecret: string,
	code: string,
	redirectUri: string,
	codeVerifier: string
) => {
	const url = KickAuthTokenBaseUrl;
	const data = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id: clientId,
		client_secret: clientSecret,
		code,
		redirect_uri: redirectUri,
		code_verifier: codeVerifier,
	});

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: data.toString(),
		});

		if (!response.ok) {
			const text = await response.text();
			// FIXME:
			console.error('Status:', response.status);
			console.error('Error:', text);
			throw new Error(`Kick token error: ${response.status}`);
		}

		return response.json();
	} catch (err) {
		// FIXME:
		console.error('Error while requesting token:', err);
		throw err;
	}
}

export const refreshAccessToken = async (
	clientId: string,
	clientSecret: string,
	refreshToken: string
) => {
	const url = KickAuthTokenBaseUrl;

	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: refreshToken,
		client_id: clientId,
		client_secret: clientSecret,
	});

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const text = await response.text();
			// FIXME:
			console.error("Refresh token error:", response.status, text);
			throw new Error(`Kick refresh error: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (err) {
		// FIXME:
		console.error("Error while refreshing tokens:", err);
		throw err;
	}
}

export const isAccessTokenValid = async (accessToken: string): Promise<boolean> =>{
	try {
		const response = await fetch(KickApiBaseUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
		});

		if (response.ok) {
			return true;
		}

		if (response.status === 401) {
			return false;
		}

		return false;
	} catch (error) {
		console.error("Token check failed:", error);
		return false;
	}
}

export const getUser = async (accessToken: string, id?: string): Promise<User> => {
	let url = `${KickApiBaseUrl}/users`;
	const params = new URLSearchParams();
	const headers = {
		"Authorization": `Bearer ${accessToken}`,
		"Accept": "*/*",
	};

	if(id) {
		params.append("id", id);
		url += "?" + params.toString();
	}

	try {
		const response = await fetch(url, { headers });

		if (!response.ok) {
			const text = await response.text();
			// FIXME:
			console.error("Error:", response.status, text);
			throw new Error(`Kick API error: ${response.status}`);
		}

		const data = await response.json();
		const user: User = {
			id: data.data[0].user_id,
			name: data.data[0].name
		}

		return user;

	} catch (err) {
		// FIXME:
		console.error("Error while requesting user:", err);
		throw err;
	}
}

export const getChannels = async (accessToken: string, slugs?: string[]): Promise<Channel[]> => {
	let url = `${KickApiBaseUrl}/channels`;
	const params = new URLSearchParams();

	if (slugs && slugs.length > 0) {
		slugs.forEach((s) => params.append("slug", s));
		url += "?" + params.toString();
	}

	try {
		const res = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${accessToken}`,
      	"Accept": "*/*"
			},
		});

		if (!res.ok) {
			throw new Error(`Request failed: ${res.status}`);
		}

		const data = await res.json();

		return data.data.map(( data: any ): Channel => {
			const channel: Channel = {
				id: data.broadcaster_user_id,
				name: "",
				slug: data.slug,
				isLive: data.stream.is_live,
				viewerCount: data.stream.viewer_count,
				streamTitle: data.stream_title,
			}

			return channel;
		});

	} catch (err) {
		console.error("getChannels error:", err);
		return [];
	}
};