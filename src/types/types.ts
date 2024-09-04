export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface WatchlistItem {
  panel: {
    title: string;
    description: string;
    images: {
      thumbnail: Array<
        {
          source: string;
          width: number;
          height: number;
        }[]
      >;
    };
  };
}

export interface WatchlistResponse {
  total: number;
  data: WatchlistItem[];
  meta: {
    total_before_filter: number;
  };
}

export interface TokenResponse2 {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  country: string;
  account_id: string;
  profile_id: string;
}


