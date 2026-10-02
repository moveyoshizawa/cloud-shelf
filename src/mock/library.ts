import type { Book, BookFolder } from "../types";

export const books: Book[] = [
  {
    id: "quiet-city-01",
    title: "Quiet City",
    author: "Volume 01",
    folder: "Manga / Quiet City",
    added: "Today",
    progress: 0.43,
    page: 84,
    pages: 196,
    accent: "linear-gradient(145deg, #efe7d6 0%, #c7a27f 52%, #745744 100%)",
  },
  {
    id: "blue-hour-02",
    title: "Blue Hour",
    author: "Volume 02",
    folder: "Manga / Blue Hour",
    added: "Today",
    progress: 0.68,
    page: 132,
    pages: 194,
    accent: "linear-gradient(145deg, #d5e2e9 0%, #7896aa 50%, #40596d 100%)",
  },
  {
    id: "small-rooms-03",
    title: "Small Rooms",
    author: "Volume 03",
    folder: "Manga / Small Rooms",
    added: "Yesterday",
    progress: 0.17,
    page: 34,
    pages: 201,
    accent: "linear-gradient(145deg, #ead8d4 0%, #a87872 50%, #65433f 100%)",
  },
  {
    id: "field-notes",
    title: "Field Notes",
    author: "Collected Edition",
    folder: "Books / Essays",
    added: "Yesterday",
    accent: "linear-gradient(145deg, #e4e6d2 0%, #899169 52%, #535b3d 100%)",
  },
  {
    id: "after-rain",
    title: "After Rain",
    author: "Volume 01",
    folder: "Manga / After Rain",
    added: "3 days ago",
    accent: "linear-gradient(145deg, #dddde5 0%, #858197 50%, #4f4b5d 100%)",
  },
  {
    id: "north-window",
    title: "North Window",
    author: "Novel",
    folder: "Books / Novels",
    added: "4 days ago",
    accent: "linear-gradient(145deg, #d9e0dc 0%, #718579 50%, #415046 100%)",
  },
  {
    id: "paper-moon",
    title: "Paper Moon",
    author: "Volume 04",
    folder: "Manga / Paper Moon",
    added: "5 days ago",
    accent: "linear-gradient(145deg, #eee0c6 0%, #b28a53 50%, #6f542f 100%)",
  },
  {
    id: "camera-notes",
    title: "Camera Notes",
    author: "Reference PDF",
    folder: "PDF / Manuals",
    added: "1 week ago",
    accent: "linear-gradient(145deg, #dfdfdb 0%, #8d8c83 52%, #55554f 100%)",
  },
];

export const continueBooks = books.filter((book) => book.progress !== undefined).slice(0, 3);

export const folders: BookFolder[] = [
  {
    id: "manga",
    title: "Manga",
    subtitle: "5 series",
    bookIds: ["quiet-city-01", "blue-hour-02", "small-rooms-03", "after-rain", "paper-moon"],
  },
  {
    id: "books",
    title: "Books",
    subtitle: "Essays & novels",
    bookIds: ["field-notes", "north-window"],
  },
  {
    id: "pdf",
    title: "PDF",
    subtitle: "Manuals & reference",
    bookIds: ["camera-notes"],
  },
];
