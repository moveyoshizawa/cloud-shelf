import type { Book, Series } from "../types";

const makeVolumes = (
  seriesId: string,
  seriesTitle: string,
  count: number,
  palette: string[],
): Book[] =>
  Array.from({ length: count }, (_, index) => ({
    id: seriesId + "-" + String(index + 1).padStart(2, "0"),
    title: seriesTitle,
    volume: index + 1,
    added: index < 2 ? "Today" : index < 4 ? "Yesterday" : "Earlier",
    progress: index === 2 ? 0.43 : index === 1 ? 0.68 : undefined,
    page: index === 2 ? 84 : index === 1 ? 132 : undefined,
    pages: 196,
    accent: palette[index % palette.length],
  }));

const quietCity = makeVolumes("quiet-city", "Quiet City", 10, [
  "linear-gradient(145deg, #efe7d6, #9c7757)",
  "linear-gradient(145deg, #e5d3c5, #8d6552)",
  "linear-gradient(145deg, #dedbc9, #77745a)",
]);

const blueHour = makeVolumes("blue-hour", "Blue Hour", 6, [
  "linear-gradient(145deg, #d5e2e9, #58748a)",
  "linear-gradient(145deg, #cadbe6, #4d6578)",
  "linear-gradient(145deg, #d1d7e2, #626a7d)",
]);

const paperMoon = makeVolumes("paper-moon", "Paper Moon", 4, [
  "linear-gradient(145deg, #eee0c6, #b28a53)",
  "linear-gradient(145deg, #e5d3ae, #9b7444)",
  "linear-gradient(145deg, #ead9bd, #806548)",
]);

export const standaloneBooks: Book[] = [
  {
    id: "field-notes",
    title: "Field Notes",
    label: "Collected Edition",
    added: "Today",
    accent: "linear-gradient(145deg, #e4e6d2, #899169)",
  },
  {
    id: "north-window",
    title: "North Window",
    label: "Novel",
    added: "Yesterday",
    accent: "linear-gradient(145deg, #d9e0dc, #718579)",
  },
  {
    id: "camera-notes",
    title: "Camera Notes",
    label: "Reference",
    added: "Earlier",
    accent: "linear-gradient(145deg, #dfdfdb, #8d8c83)",
  },
];

export const books: Book[] = [...quietCity, ...blueHour, ...paperMoon, ...standaloneBooks];

export const series: Series[] = [
  { id: "quiet-city", title: "Quiet City", volumeIds: quietCity.map((book) => book.id) },
  { id: "blue-hour", title: "Blue Hour", volumeIds: blueHour.map((book) => book.id) },
  { id: "paper-moon", title: "Paper Moon", volumeIds: paperMoon.map((book) => book.id) },
];

export const continueBooks = [quietCity[2], blueHour[1], standaloneBooks[0]];

export const newOnShelf = [quietCity[9], blueHour[5], paperMoon[3], standaloneBooks[0]];
