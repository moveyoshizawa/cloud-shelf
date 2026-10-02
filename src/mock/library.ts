import type { ShelfItem, ShelfSection } from "../types";

export const continueItems: ShelfItem[] = [
  {
    id: "manga-01",
    kind: "book",
    title: "Evening Reader",
    subtitle: "Page 84",
    progress: 0.43,
    accent: "linear-gradient(145deg, #efe7d6 0%, #c9a887 48%, #765a48 100%)",
  },
  {
    id: "album-01",
    kind: "music",
    title: "Late Run",
    subtitle: "Track 7",
    progress: 0.58,
    accent: "linear-gradient(145deg, #d3e0e7 0%, #6f8da3 50%, #314657 100%)",
  },
  {
    id: "game-01",
    kind: "game",
    title: "Weekend Save",
    subtitle: "Yesterday",
    accent: "linear-gradient(145deg, #ddd2c7 0%, #927868 48%, #4e4039 100%)",
  },
  {
    id: "video-01",
    kind: "video",
    title: "Night Drive",
    subtitle: "38 min left",
    progress: 0.66,
    accent: "linear-gradient(145deg, #bcc7bf 0%, #627468 50%, #26342b 100%)",
  },
];

const books: ShelfItem[] = [
  { id: "book-1", kind: "book", title: "Quiet City", accent: "linear-gradient(145deg, #eadfcf, #9c7757)" },
  { id: "book-2", kind: "book", title: "Blue Hour", accent: "linear-gradient(145deg, #ccdbe4, #58748a)" },
  { id: "book-3", kind: "book", title: "Small Rooms", accent: "linear-gradient(145deg, #e4d2cf, #8f625d)" },
  { id: "book-4", kind: "book", title: "Field Notes", accent: "linear-gradient(145deg, #d7dac7, #72795a)" },
  { id: "book-5", kind: "book", title: "After Rain", accent: "linear-gradient(145deg, #d9d8df, #696677)" },
];

const music: ShelfItem[] = [
  { id: "music-1", kind: "music", title: "Sunroom", accent: "linear-gradient(145deg, #f0d9b0, #a6654a)" },
  { id: "music-2", kind: "music", title: "Night Bus", accent: "linear-gradient(145deg, #a8c2d2, #3e5768)" },
  { id: "music-3", kind: "music", title: "Still Air", accent: "linear-gradient(145deg, #d9d4c9, #6f6b62)" },
  { id: "music-4", kind: "music", title: "Neon Lake", accent: "linear-gradient(145deg, #c6b8d7, #5c4c74)" },
  { id: "music-5", kind: "music", title: "Sunday AM", accent: "linear-gradient(145deg, #dae0bd, #718153)" },
];

const games: ShelfItem[] = [
  { id: "game-1", kind: "game", title: "Green Valley", accent: "linear-gradient(145deg, #c9dbbd, #55704f)" },
  { id: "game-2", kind: "game", title: "Starline", accent: "linear-gradient(145deg, #b7c7dc, #4b5f7a)" },
  { id: "game-3", kind: "game", title: "Red Harbor", accent: "linear-gradient(145deg, #deb9b0, #78483f)" },
  { id: "game-4", kind: "game", title: "Tiny Quest", accent: "linear-gradient(145deg, #e5d2ac, #8c6c38)" },
  { id: "game-5", kind: "game", title: "Orbit", accent: "linear-gradient(145deg, #c8c5dc, #57536f)" },
];

const videos: ShelfItem[] = [
  { id: "video-1", kind: "video", title: "City Lights", accent: "linear-gradient(145deg, #b9c8cf, #4c636f)" },
  { id: "video-2", kind: "video", title: "Long Weekend", accent: "linear-gradient(145deg, #e0c4ad, #895f43)" },
  { id: "video-3", kind: "video", title: "Window Seat", accent: "linear-gradient(145deg, #cad3c7, #596b59)" },
  { id: "video-4", kind: "video", title: "Night Walk", accent: "linear-gradient(145deg, #bbb9c8, #535164)" },
];

const documents: ShelfItem[] = [
  { id: "document-1", kind: "document", title: "Camera Manual", accent: "linear-gradient(145deg, #d9d9d5, #7b7b75)" },
  { id: "document-2", kind: "document", title: "Travel Notes", accent: "linear-gradient(145deg, #ddd4c5, #80705c)" },
  { id: "document-3", kind: "document", title: "Reference", accent: "linear-gradient(145deg, #ccd6d8, #637377)" },
  { id: "document-4", kind: "document", title: "Archive", accent: "linear-gradient(145deg, #d5cfda, #706778)" },
];

export const shelves: ShelfSection[] = [
  { id: "book", title: "Books", count: 128, items: books },
  { id: "music", title: "Music", count: 64, items: music },
  { id: "game", title: "Games", count: 42, items: games },
  { id: "video", title: "Video", count: 18, items: videos },
  { id: "document", title: "Files", count: 91, items: documents },
];
