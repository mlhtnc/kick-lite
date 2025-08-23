import { API_HOST } from "@env";

export const getStreamURL = async (channel: string): Promise<any> => {

  if(API_HOST === undefined) return null;

  let url = `${API_HOST}/get_stream_url`;

  const data = {
    channel: channel
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    const response = await res.json();

    return {
      streamURL: response.stream_url
    }
  } catch (err) {
    console.error("getStreamURL error:", err);
    return [];
  }
};