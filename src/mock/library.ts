import type { ContinueItem, LibrarySection } from "../types";

export const continueItems: ContinueItem[] = [
  {
    id: "manga-01",
    kind: "book",
    title: "Evening Reader",
    subtitle: "Page 84 of 196",
    progress: 0.43,
    accent: "linear-gradient(145deg, #efe7d6, #a58365)",
  },
  {
    id: "album-01",
    kind: "music",
    title: "Late Run",
    subtitle: "Track 7 of 12",
    progress: 0.58,
    accent: "linear-gradient(145deg, #b8cad7, #4f677c)",
  },
  {
    id: "game-01",
    kind: "game",
    title: "Weekend Save",
    subtitle: "Last played yesterday",
    accent: "linear-gradient(145deg, #d5cabf, #725f54)",
  },
];

export const librarySections: LibrarySection[] = [
  { id: "book", title: "Books", subtitle: "Manga, books & PDFs", count: 128, accent: "#a58365" },
  { id: "music", title: "Music", subtitle: "Albums & playlists", count: 64, accent: "#58768e" },
  { id: "game", title: "Games", subtitle: "Retro library", count: 42, accent: "#75655b" },
  { id: "video", title: "Video", subtitle: "Movies & clips", count: 18, accent: "#6f7b70" },
  { id: "document", title: "Files", subtitle: "Manuals & documents", count: 91, accent: "#777777" },
];
