'use server'

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'

const TOKEN_CACHE_TAG = 'spotify-token'

const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
})

const trackSchema = z.object({
  name: z.string(),
  artists: z.array(z.object({ name: z.string() })),
  album: z.object({
    name: z.string(),
    images: z.array(z.object({ url: z.string() })),
  }),
})

const currentlyPlayingSchema = z.object({
  is_playing: z.boolean(),
  item: trackSchema,
})

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('Missing Spotify credentials or refresh token')
    return null
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
      next: { revalidate: 3600, tags: [TOKEN_CACHE_TAG] },
    })

    const data = await response.json()
    const parsedData = tokenSchema.parse(data)

    return parsedData.access_token
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}

async function spotifyFetcher<T>(f: (token: string, ...args: any[]) => Promise<T | number>, ...args: any[]): Promise<T | number> {
  const token = await getAccessToken()
  if (!token) return 401

  const result = await f(token, ...args)
  if (typeof result === 'number' && result === 401) {
    revalidateTag(TOKEN_CACHE_TAG)
    const newToken = await getAccessToken()
    if (!newToken) return 401
    return f(newToken, ...args)
  }
  return result
}

async function getCurrentlyPlayingFetcher(token: string): Promise<z.infer<typeof currentlyPlayingSchema> | number> {
  const response = await fetch(PLAYER_ENDPOINT, {
    headers: { 'Authorization': `Bearer ${token}` },
    next: { revalidate: 30 },
  })

  if (response.status !== 200) return response.status

  const data = await response.json()
  return currentlyPlayingSchema.parse(data)
}

export async function getCurrentTrack() {
  const result = await spotifyFetcher(getCurrentlyPlayingFetcher)

  if (typeof result === 'number') {
    if (result === 204) return null // No track currently playing
    throw new Error(`Unexpected response status: ${result}`)
  }

  return {
    name: result.item.name,
    artist: result.item.artists.map(artist => artist.name).join(', '),
    album: result.item.album.name,
    albumArt: result.item.album.images[0].url,
    isPlaying: result.is_playing
  }
}