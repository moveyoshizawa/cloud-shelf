import type { Book, Series } from "../types";

const makeVolumes = (
  seriesId: string,
  seriesTitle: string,
  author: string,
  firstYear: number,
  count: number,
  palette: string[],
): Book[] =>
  Array.from({ length: count }, (_, index) => ({
    id: seriesId + "-" + String(index + 1).padStart(2, "0"),
    title: seriesTitle,
    author,
    volume: index + 1,
    year: firstYear + Math.floor(index / 3),
    added: index < 2 ? "Today" : index < 4 ? "Yesterday" : "Earlier",
    progress: index === 2 ? 0.43 : index === 1 ? 0.68 : undefined,
    page: index === 2 ? 84 : index === 1 ? 132 : undefined,
    pages: 196,
    accent: palette[index % palette.length],
    binding: "rtl",
    hasCover: true,
  }));

const quietCity = makeVolumes("quiet-city", "Quiet City", "A. Mori", 2022, 10, [
  "linear-gradient(145deg, #efe7d6, #9c7757)",
  "linear-gradient(145deg, #e5d3c5, #8d6552)",
  "linear-gradient(145deg, #dedbc9, #77745a)",
]);

const blueHour = makeVolumes("blue-hour", "Blue Hour", "R. Aoki", 2024, 6, [
  "linear-gradient(145deg, #d5e2e9, #58748a)",
  "linear-gradient(145deg, #cadbe6, #4d6578)",
  "linear-gradient(145deg, #d1d7e2, #626a7d)",
]);

const paperMoon = makeVolumes("paper-moon", "Paper Moon", "M. Sato", 2023, 4, [
  "linear-gradient(145deg, #eee0c6, #b28a53)",
  "linear-gradient(145deg, #e5d3ae, #9b7444)",
  "linear-gradient(145deg, #ead9bd, #806548)",
]);

export const standaloneBooks: Book[] = [
  {
    id: "field-notes",
    title: "Field Notes",
    author: "K. Hayashi",
    label: "Collected Edition",
    year: 2025,
    added: "Today",
    progress: 0.24,
    page: 41,
    pages: 172,
    accent: "linear-gradient(145deg, #e4e6d2, #899169)",
    binding: "ltr",
    hasCover: true,
  },
  {
    id: "north-window",
    title: "North Window",
    author: "N. Ito",
    label: "Novel",
    year: 2021,
    added: "Yesterday",
    accent: "linear-gradient(145deg, #d9e0dc, #718579)",
    binding: "ltr",
    hasCover: true,
  },
  {
    id: "camera-notes",
    title: "Camera Notes",
    author: "Studio 18",
    label: "Reference",
    year: 2026,
    added: "Earlier",
    accent: "linear-gradient(145deg, #d9d7cf, #89877e)",
    binding: "ltr",
    hasCover: false,
  },
];

export const books: Book[] = [...quietCity, ...blueHour, ...paperMoon, ...standaloneBooks];

export const series: Series[] = [
  { id: "quiet-city", title: "Quiet City", volumeIds: quietCity.map((book) => book.id) },
  { id: "blue-hour", title: "Blue Hour", volumeIds: blueHour.map((book) => book.id) },
  { id: "paper-moon", title: "Paper Moon", volumeIds: paperMoon.map((book) => book.id) },
];

export const continueBooks = [quietCity[2], blueHour[1], standaloneBooks[0]];
