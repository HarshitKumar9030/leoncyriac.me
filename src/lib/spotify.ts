"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const PLAYER_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played";

const TOKEN_CACHE_TAG = "spotify-token";

const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

const trackSchema = z.object({
  name: z.string(),
  artists: z.array(z.object({ name: z.string() })),
  album: z.object({
    name: z.string(),
    images: z.array(z.object({ url: z.string() })),
  }),
  duration_ms: z.number(),
});

const currentlyPlayingSchema = z.object({
  is_playing: z.boolean(),
  item: trackSchema.nullable(),
  progress_ms: z.number().nullable(),
});

const recentlyPlayedSchema = z.object({
  items: z.array(
    z.object({
      track: trackSchema,
      played_at: z.string(),
    })
  ),
});

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error("Missing Spotify credentials or refresh token");
    return null;
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }),
      next: { revalidate: 3600, tags: [TOKEN_CACHE_TAG] },
    });

    const data = await response.json();
    const parsedData = tokenSchema.parse(data);

    return parsedData.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

async function spotifyFetcher<T>(
  f: (token: string, ...args: any[]) => Promise<T | number>,
  ...args: any[]
): Promise<T | number> {
  const token = await getAccessToken();
  if (!token) return 401;

  const result = await f(token, ...args);
  if (typeof result === "number" && result === 401) {
    revalidateTag(TOKEN_CACHE_TAG);
    const newToken = await getAccessToken();
    if (!newToken) return 401;
    return f(newToken, ...args);
  }
  return result;
}

async function getCurrentlyPlayingFetcher(
  token: string
): Promise<z.infer<typeof currentlyPlayingSchema> | number | null> {
  const response = await fetch(PLAYER_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 }, 
  });

  if (response.status === 204) {
    return null; 
  }

  if (response.status !== 200) {
    return response.status;
  }

  const data = await response.json();
  return currentlyPlayingSchema.parse(data);
}

async function getRecentlyPlayedFetcher(
  token: string
): Promise<z.infer<typeof recentlyPlayedSchema> | number> {
  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (response.status !== 200) return response.status;

  const data = await response.json();
  return recentlyPlayedSchema.parse(data);
}

export async function getCurrentTrack() {
  const result = await spotifyFetcher(getCurrentlyPlayingFetcher);

  if (result === null || typeof result === "number") {
    return null; 
  }

  return {
    name: result.item?.name ?? "",
    artist: result.item?.artists.map((artist) => artist.name).join(", ") ?? "",
    album: result.item?.album.name ?? "",
    albumArt: result.item?.album.images[0]?.url ?? "",
    isPlaying: result.is_playing,
    duration: result.item?.duration_ms ?? 0,
    progress: result.progress_ms ?? 0,
  };
}

export async function getLiveTrackInfo() {
  const currentTrack = await getCurrentTrack();
  const recentlyPlayedResult = await spotifyFetcher(getRecentlyPlayedFetcher);

  let lastPlayed = null;
  if (
    typeof recentlyPlayedResult !== "number" &&
    recentlyPlayedResult.items.length > 0
  ) {
    const lastPlayedTrack = recentlyPlayedResult.items[0].track;
    lastPlayed = {
      name: lastPlayedTrack.name,
      artist: lastPlayedTrack.artists.map((artist) => artist.name).join(", "),
      album: lastPlayedTrack.album.name,
      albumArt: lastPlayedTrack.album.images[0].url,
      playedAt: recentlyPlayedResult.items[0].played_at,
    };
  }

  return {
    currentTrack,
    lastPlayed,
  };
}