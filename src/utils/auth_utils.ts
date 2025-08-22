import 'react-native-get-random-values';
import { sha256 } from 'react-native-sha256';
import base64 from 'react-native-base64';
import queryString from 'query-string';

import { KickAuthBaseUrl } from '../constants';


export const generatePKCE = async (length: number = 64) => {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);

	const code_verifier = base64UrlEncode(array);
	const hashHex = await sha256(code_verifier);
	const hashBytes = hexToBytes(hashHex);
	const code_challenge = base64UrlEncode(hashBytes);

	return { code_verifier, code_challenge };
}

const base64UrlEncode = (buffer: Uint8Array): string => {
	let base64x = base64.encode(String.fromCharCode.apply(null, buffer as any));
	return base64x.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const hexToBytes = (hex: string): Uint8Array => {
	const bytes = [];
	for (let c = 0; c < hex.length; c += 2) {
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}
	return new Uint8Array(bytes);
}

const generateState = (length: number = 16): string => {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);

	let state = base64.encodeFromByteArray(array);
	state = state.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

	return state;
}

export const createAuthUrl = (
	clientId: string,
	redirectUri: string,
	scope: string,
	codeChallenge: string,
): string => {
	const baseUrl = KickAuthBaseUrl;
	const params = {
		response_type: 'code',
		client_id: clientId,
		redirect_uri: redirectUri,
		scope,
		code_challenge: codeChallenge,
		code_challenge_method: 'S256',
		state: generateState(),
	};
	return `${baseUrl}?${queryString.stringify(params)}`;
}


