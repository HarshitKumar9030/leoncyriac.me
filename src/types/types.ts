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
  data: WatchlistItem2[];
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

export interface WatchlistItem2 {
  panel: {
    channel_id: string;
    title: string;
    description: string;
    slug: string;
    linked_resource_key: string;
    images: {
      thumbnail: {
        source: string;
        width: number;
        height: number;
      }[][];
    };
    id: string;
    promo_description: string;
    external_id: string;
    promo_title: string;
    type: string;
    slug_title: string;
    episode_metadata: {
      episode_title: string;
      ad_breaks: any[];
      audio_locale: string;
      availability_ends: string;
      availability_notes: string;
      availability_starts: string;
      availability_status: string;
      available_date: string | null;
      available_offline: boolean;
      closed_captions_available: boolean;
      duration_ms: number;
      eligible_region: string;
      episode: string;
      episode_air_date: string;
      episode_number: number;
      extended_maturity_rating: Record<string, unknown>;
      free_available_date: string;
      identifier: string;
      is_clip: boolean;
      is_dubbed: boolean;
      is_mature: boolean;
      is_premium_only: boolean;
      is_subbed: boolean;
      mature_blocked: boolean;
      maturity_ratings: any[];
      premium_available_date: string;
      premium_date: string | null;
      season_display_number: string;
      season_id: string;
      season_number: number;
      season_sequence_number: number;
      season_slug_title: string;
      season_title: string;
      sequence_number: number;
      series_id: string;
      series_slug_title: string;
      series_title: string;
      subtitle_locales: any[];
      upload_date: string;
      versions: any[];
    };
  };
  new: boolean;
  is_favorite: boolean;
  fully_watched: boolean;
  never_watched: boolean;
  playhead: number;
}

export interface WatchListPanel {
  channel_id: string;
    title: string;
    description: string;
    slug: string;
    linked_resource_key: string;
    images: {
      thumbnail: {
        source: string;
        width: number;
        height: number;
      }[][];
    };
    id: string;
    promo_description: string;
    external_id: string;
    promo_title: string;
    type: string;
    slug_title: string;
    episode_metadata: {
      episode_title: string;
      ad_breaks: any[];
      audio_locale: string;
      availability_ends: string;
      availability_notes: string;
      availability_starts: string;
      availability_status: string;
      available_date: string | null;
      available_offline: boolean;
      closed_captions_available: boolean;
      duration_ms: number;
      eligible_region: string;
      episode: string;
      episode_air_date: string;
      episode_number: number;
      extended_maturity_rating: Record<string, unknown>;
      free_available_date: string;
      identifier: string;
      is_clip: boolean;
      is_dubbed: boolean;
      is_mature: boolean;
      is_premium_only: boolean;
      is_subbed: boolean;
      mature_blocked: boolean;
      maturity_ratings: any[];
      premium_available_date: string;
      premium_date: string | null;
      season_display_number: string;
      season_id: string;
      season_number: number;
      season_sequence_number: number;
      season_slug_title: string;
      season_title: string;
      sequence_number: number;
      series_id: string;
      series_slug_title: string;
      series_title: string;
      subtitle_locales: any[];
      upload_date: string;
      versions: any[];
    };
}
