export interface Song {
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
}

export interface Content {
  title: string;
  description: string;
  playlist: Song[];
}

export async function getNewYearContent(): Promise<Content> {
  return {
    title: "2025",
    description:
      "As we stand on the cusp of a new era, let us embrace the elegance and promise of 2025. May this year be a canvas for our boldest dreams and most refined aspirations, where every moment shimmers with possibility and grace.",
    playlist: [
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        albumArt:
          "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        audioUrl: "https://music.leoncyriac.me/play/1735667419752",
      },
      {
        title: "Line Without a Hook",
        artist: "Ricky Montgomery",
        albumArt:
          "https://i.scdn.co/image/ab67616d0000b27367ee332af483acd134fd6fd0",
        audioUrl: "https://music.leoncyriac.me/play/1735668685987",
      },
    ],
  };
}
