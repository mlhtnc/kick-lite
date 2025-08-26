import { KickApiBaseUrl, KickAuthTokenBaseUrl, KickAuthTokenIntrospectUrl } from "../constants";
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
			throw new Error();
		}

		return response.json();
	} catch (err) {
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
			throw new Error();
		}

		const data = await response.json();
		return data;
	} catch (err) {
		throw err;
	}
}

export const isAccessTokenValid = async (accessToken: string): Promise<boolean> => {
	try {
		const response = await fetch(KickAuthTokenIntrospectUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.ok) {
			return true;
		}

		if (response.status === 401) {
			return false;
		}

		throw new Error();
	} catch (err) {
		throw err;
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
			throw new Error();
		}

		const data = await response.json();
		const user: User = {
			id: data.data[0].user_id,
			name: data.data[0].name
		}

		return user;

	} catch (err) {
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
			throw new Error();
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
		throw err;
	}
};

export const postMessage = async (
	accessToken: string,
	userId: string,
	content: string,
) => {
	let url = `${KickApiBaseUrl}/chat`;
	const data = {
		broadcaster_user_id: userId,
		content: content,
		type: "user"
	};


	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error();
		}

		return response.json();
	} catch (err) {
		throw err;
	}
}