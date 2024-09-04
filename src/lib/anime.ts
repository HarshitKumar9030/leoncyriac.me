import axios from 'axios';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

const favoriteMALIds = [16498, 23273, 5081, 38000, 19, 22319,34572 , 52034, 52299, ];

export async function fetchAnime(): Promise<Anime[]> {
  try {
    const animeDataPromises = favoriteMALIds.map((id) =>
      axios.get(`https://api.jikan.moe/v4/anime/${id}`)
    );

    const responses = await Promise.all(animeDataPromises);

    const animeData: Anime[] = responses.map((response) => ({
      mal_id: response.data.data.mal_id,
      title: response.data.data.title,
      images: response.data.data.images,
    }));

    return animeData;
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return [];
  }
}
