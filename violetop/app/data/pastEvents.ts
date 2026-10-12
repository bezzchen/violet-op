export type PastEvent = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  description: string;
  location?: string;
  cover: string;
  coverAlt: string;
  coverPosition: string;
  albumUrl: string;
};

/** Completed events confirmed against the school media archive and event recaps. */
export const pastEvents: PastEvent[] = [
  {
    slug: "geng-fireside-chat-2026",
    title: "A fireside chat with Gen.G",
    date: "2026-10-09",
    dateLabel: "October 9, 2026",
    category: "Conversation",
    description: "Violet OP welcomed Gen.G CEO Arnold Hur for a conversation about esports, careers, and community, followed by questions from the audience.",
    location: "Palladium Multipurpose Room · NYU",
    cover: "/images/media/geng-fireside-chat-2026/1PwxDq-_iFr_ZWALUG-JuKcXjj61qrmbD.webp",
    coverAlt: "Arnold Hur and the moderator on stage at the Gen.G fireside chat",
    coverPosition: "50% 50%",
    albumUrl: "https://drive.google.com/drive/folders/1kcrBwLDgHmYb5rPW3QxRJxDk7lhP11PF",
  },
  {
    slug: "level-up-valorant-2026",
    title: "LEVEL UP! VALORANT",
    date: "2026-09-20",
    dateLabel: "September 20, 2026",
    category: "Community play",
    description: "VALORANT, community activities, and prizes brought players and friends together to play and meet the people behind the game.",
    cover: "/images/events/photos/level-up-valorant-group-1920.webp",
    coverAlt: "The LEVEL UP! VALORANT community posing together with prizes",
    coverPosition: "50% 43%",
    albumUrl: "https://drive.google.com/drive/folders/1fNa6t8xGgbT948JzjHFH-RGT4NlxdTXE",
  },
  {
    slug: "level-up-league-2026",
    title: "LEVEL UP! League of Legends",
    date: "2026-09-13",
    dateLabel: "September 13, 2026",
    category: "Community play",
    description: "League of Legends brought the community together for open play, shared screens, and prize moments, with friends watching and joining in throughout the event.",
    cover: "/images/events/photos/level-up-league-play-1920.webp",
    coverAlt: "A player at a League of Legends station during LEVEL UP!",
    coverPosition: "50% 40%",
    albumUrl: "https://drive.google.com/drive/folders/1MR3fpChyKVCCEZfnLOSNvl9ADxIrhkNf",
  },
  {
    slug: "vct-americas-watch-party-2026",
    title: "VCT Americas Watch Party",
    date: "2026-09-06",
    dateLabel: "September 6, 2026",
    category: "Watch party",
    description: "The VOP community watched the VCT Americas Grand Finals together, with activities, prizes, and plenty of moments beyond the broadcast.",
    cover: "/images/events/photos/vct-americas-watch-party-1920.webp",
    coverAlt: "The VOP community watching VALORANT on a projected screen",
    coverPosition: "50% 60%",
    albumUrl: "https://drive.google.com/drive/folders/1MOQIqtZA3OaRIRZNGBdZHo0yJpBQaOnM",
  },
];

export type EventMediaItem = {
  id: string;
  kind: "photo" | "video" | "reel" | "poster";
  label: string;
  sourceUrl: string;
  src?: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
};
