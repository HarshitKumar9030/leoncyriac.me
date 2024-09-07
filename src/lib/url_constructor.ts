import { WatchListPanel } from "@/types/types";

// contructs the crunchyroll url.

export const constructAnimeUrl = ( payload: WatchListPanel ) => {
    if (!payload.description || !payload.episode_metadata.series_id || !payload.slug_title) {
        console.error("Invalid payload supplied! \n Please supply a proper WatchList[index].panel.")
        return;
    }
    const seriedId = payload.id;
    const slug = payload.slug_title;
    // console.log("\n\n" + slug)

    const url = `https://www.crunchyroll.com/watch/${seriedId}/${slug}`

    return url;
}