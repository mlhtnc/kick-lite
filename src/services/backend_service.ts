import { API_HOST } from "@env";
import { StreamURL } from "../types";


export const getStreamURLs = async (channel: string): Promise<StreamURL[] | null> => {

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
      throw new Error();
    }

    const response = await res.json();
    return response.formats;
  } catch (err) {
    throw err;
  }
};