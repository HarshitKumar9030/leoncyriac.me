"use server";
import { TokenResponse, WatchlistResponse, TokenResponse2 } from '@/types/types';

const API_URL = "https://beta-api.crunchyroll.com/auth/v1/token";
const CRUNCHYROLL_COOKIE = process.env.NEXT_PUBLIC_CRUNCHYROLL_COOKIE;

if (!CRUNCHYROLL_COOKIE) {
  throw new Error('Crunchyroll cookie not found. Please set NEXT_PUBLIC_CRUNCHYROLL_COOKIE in your environment variables.');
}

export async function getAnonymousUserId(): Promise<TokenResponse | null> {
  try {
    const response: Response = await fetch(API_URL, {
      headers: {
        authorization: "Basic Y3Jfd2ViOg==",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_id",
      method: "POST",
    });

    if (!response.ok) {
      console.error(`Failed to fetch token: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: TokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching token: ${error}`);
    return null;
  }
}

export async function getToken(): Promise<TokenResponse2 | null> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        authorization: "Basic bm9haWhkZXZtXzZpeWcwYThsMHE6",
        "Cookie": CRUNCHYROLL_COOKIE as string,
        "Content-Type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
      },
      method: "POST",
      body: `device_type=Chrome%20on%20Android&device_id=babacec7-753a-44da-a245-98c3245e6cab&grant_type=etp_rt_cookie`
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch token: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: TokenResponse2 = await response.json();
    return data; 
  } catch (error) {
    console.error(`Error fetching token: ${error}`);
    return null;
  }
}

export async function getWatchList(
  options: {
    n?: number;
    start?: number;
    order?: 'desc' | 'asc';
    type?: 'series' | 'movie_listing';
    sort_by?: 'date_updated' | 'date_watched' | 'date_added' | 'alphabetical';
    is_favorite?: boolean;
    is_dubbed?: boolean;
    is_subbed?: boolean;
  } = {}
): Promise<WatchlistResponse | null> {
  try {
    const tokenResponse = await getToken();

    if (!tokenResponse) {
      throw new Error('Failed to fetch token.');
    }

    const { access_token, profile_id } = tokenResponse;

    // Construct the URL with query parameters
    const params = new URLSearchParams({
      n: options.n?.toString() || '',
      start: options.start?.toString() || '',
      order: options.order || '',
      type: options.type || '',
      sort_by: options.sort_by || '',
      is_favorite: options.is_favorite?.toString() || '',
      is_dubbed: options.is_dubbed?.toString() || '',
      is_subbed: options.is_subbed?.toString() || '',
      locale: "en-us",
    });

    const response = await fetch(
      `https://beta-api.crunchyroll.com/content/v2/discover/${profile_id}/watchlist?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Cookie": CRUNCHYROLL_COOKIE as string,
          'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
        },
      }
    );

    if (!response.ok) {
      console.log(response)
      throw new Error(`Failed to fetch watchlist: ${response.status} ${response.statusText}`);
    }
    const data: WatchlistResponse = await response.json();
    // console.log(data.data[2].panel as any)
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching the watchlist:', error.message);
      throw new Error(`Failed to fetch watchlist: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
}


