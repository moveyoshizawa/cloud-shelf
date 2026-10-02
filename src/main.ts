import "./styles/app.css";
import { books, continueBooks, series, standaloneBooks } from "./mock/library";
import type { Book, Series } from "./types";

type Route =
  | { name: "home" }
  | { name: "series"; id: string }
  | { name: "reader"; id: string };

type SortMode = "title" | "author" | "added";

type LibraryEntry =
  | { type: "series"; id: string; title: string; author: string; series: Series; displayBook: Book }
  | { type: "book"; id: string; title: string; author: string; book: Book; displayBook: Book };

let searchQuery = "";
let sortMode: SortMode = "title";
let menuOpen = false;

const legacyLabelMode = localStorage.getItem("cloud-shelf-books:labels");
let showTitleLabel =
  localStorage.getItem("cloud-shelf-books:show-title") === "true" ||
  (localStorage.getItem("cloud-shelf-books:show-title") === null &&
    (legacyLabelMode === "title" || legacyLabelMode === "full"));
let showAuthorLabel =
  localStorage.getItem("cloud-shelf-books:show-author") === "true" ||
  (localStorage.getItem("cloud-shelf-books:show-author") === null && legacyLabelMode === "full");
let showVolume = localStorage.getItem("cloud-shelf-books:show-volume") !== "false";

const CONTINUE_LIMIT = 6;

function route(): Route {
  const hash = location.hash.replace(/^#\/?/, "");
  if (!hash) return { name: "home" };

  const parts = hash.split("/");
  if (parts[0] === "series" && parts[1]) return { name: "series", id: parts[1] };
  if (parts[0] === "reader" && parts[1]) return { name: "reader", id: parts[1] };
  return { name: "home" };
}

function navigate(path: string): void {
  location.hash = path;
}

function activeVolume(item: Series): Book {
  const volumes = item.volumeIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => Boolean(book));

  const inProgress = volumes
    .filter((book) => book.progress !== undefined && book.progress > 0 && book.progress < 1)
    .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));

  return inProgress[0] ?? volumes[0];
}

function titleLine(book: Book): string {
  return book.volume ? book.title + " (" + book.volume + ")" : book.title;
}

function coverInfo(book: Book, totalVolumes?: number): string {
  if (!showVolume || !book.volume || !totalVolumes) return "";

  const current = String(book.volume).padStart(2, "0");
  const total = String(totalVolumes).padStart(2, "0");

  return (
    '<span class="cover-info" aria-hidden="true">' +
      '<span class="cover-volume">' + current + "/" + total + '</span>' +
    '</span>'
  );
}

function progressMarkup(book: Book): string {
  if (book.progress === undefined) return "";

  return (
    '<span class="cover-progress" aria-hidden="true">' +
      '<span style="--progress: ' + Math.round(book.progress * 100) + '%"></span>' +
    '</span>'
  );
}

function bindingMarkup(book: Book): string {
  return '<span class="binding-edge binding-edge--' + book.binding + '" aria-hidden="true"></span>';
}

function fallbackTitleMarkup(book: Book): string {
  if (book.hasCover) return "";

  return (
    '<span class="fallback-cover-copy">' +
      '<strong>' + book.title + '</strong>' +
      (book.volume ? '<span>' + String(book.volume).padStart(2, "0") + '</span>' : '') +
    '</span>'
  );
}

function labelMarkup(book: Book): string {
  if (!showTitleLabel && !showAuthorLabel) return "";

  return (
    '<span class="book-labels">' +
      (showTitleLabel ? '<span class="book-title">' + titleLine(book) + '</span>' : '') +
      (showAuthorLabel ? '<span class="book-author' + (showTitleLabel ? '' : ' book-author--solo') + '">' + book.author + '</span>' : '') +
    '</span>'
  );
}

function coverArtMarkup(book: Book, totalVolumes?: number): string {
  return (
    '<span class="book-art' + (book.hasCover ? '' : ' book-art--fallback') + '" style="--cover-accent: ' + book.accent + '">' +
      '<span class="cover-shape cover-shape--one" aria-hidden="true"></span>' +
      '<span class="cover-shape cover-shape--two" aria-hidden="true"></span>' +
      bindingMarkup(book) +
      fallbackTitleMarkup(book) +
      coverInfo(book, totalVolumes) +
      progressMarkup(book) +
    '</span>'
  );
}

function cover(book: Book, variant: "continue" | "grid" = "grid", totalVolumes?: number): string {
  return (
    '<span class="book-cover book-cover--' + variant + '">' +
      coverArtMarkup(book, totalVolumes) +
      labelMarkup(book) +
    '</span>'
  );
}

function seriesCover(item: Series): string {
  const front = activeVolume(item);
  const others = item.volumeIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => Boolean(book))
    .filter((book) => book.id !== front.id)
    .slice(0, 3);

  const backs = others
    .map((book, index) =>
      '<span class="series-back series-back--' + (index + 1) + '" style="--cover-accent: ' + book.accent + '">' +
        '<span class="cover-shape cover-shape--one" aria-hidden="true"></span>' +
        '<span class="cover-shape cover-shape--two" aria-hidden="true"></span>' +
        bindingMarkup(book) +
      '</span>'
    )
    .join("");

  return (
    '<span class="stacked-book">' +
      '<span class="stack-art-wrap">' +
        backs +
        '<span class="stack-front">' +
          coverArtMarkup(front, item.volumeIds.length) +
        '</span>' +
      '</span>' +
      labelMarkup(front) +
    '</span>'
  );
}

function searchField(): string {
  return (
    '<label class="search-field" aria-label="Search books">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="6.5"></circle>' +
        '<path d="m16 16 4 4"></path>' +
      '</svg>' +
      '<input id="search-input" type="search" inputmode="search" placeholder="" value="' +
        searchQuery.replace(/"/g, "&quot;") +
      '" aria-label="Search books" />' +
    '</label>'
  );
}

function header(): string {
  return (
    '<header class="home-header">' +
      '<div class="brand-row">' +
        '<div><div class="eyebrow">Cloud Shelf</div><h1 class="brand">Books</h1></div>' +
        '<button class="icon-button more-button" id="open-menu" type="button" aria-label="Library options">•••</button>' +
      '</div>' +
      searchField() +
    '</header>'
  );
}

function libraryEntries(): LibraryEntry[] {
  const groupedIds = new Set(series.flatMap((item) => item.volumeIds));
  const entries: LibraryEntry[] = [
    ...series.map((item) => {
      const displayBook = activeVolume(item);
      return {
        type: "series" as const,
        id: item.id,
        title: item.title,
        author: displayBook.author,
        series: item,
        displayBook,
      };
    }),
    ...standaloneBooks
      .filter((book) => !groupedIds.has(book.id))
      .map((book) => ({
        type: "book" as const,
        id: book.id,
        title: book.title,
        author: book.author,
        book,
        displayBook: book,
      })),
  ];

  const query = searchQuery.trim().toLocaleLowerCase();
  const filtered = query
    ? entries.filter((entry) => {
        const volumeText = entry.displayBook.volume ? " " + entry.displayBook.volume : "";
        return (entry.title + " " + entry.author + volumeText).toLocaleLowerCase().includes(query);
      })
    : entries;

  return filtered.sort((a, b) => {
    if (sortMode === "title") {
      return a.title.localeCompare(b.title) || a.author.localeCompare(b.author);
    }

    if (sortMode === "author") {
      return a.author.localeCompare(b.author) || a.title.localeCompare(b.title);
    }

    const rank = (value: string): number => value === "Today" ? 0 : value === "Yesterday" ? 1 : 2;
    return rank(a.displayBook.added) - rank(b.displayBook.added) || a.title.localeCompare(b.title);
  });
}

function menuMarkup(): string {
  if (!menuOpen) return "";

  const sortOption = (mode: SortMode, label: string) =>
    '<button class="menu-row" type="button" data-sort="' + mode + '">' +
      '<span>' + label + '</span>' +
      '<span class="menu-check" aria-hidden="true">' + (sortMode === mode ? "✓" : "") + '</span>' +
    '</button>';

  const toggleOption = (setting: "title" | "author" | "volume", label: string, checked: boolean) =>
    '<button class="menu-row" type="button" data-setting="' + setting + '">' +
      '<span>' + label + '</span>' +
      '<span class="menu-check" aria-hidden="true">' + (checked ? "✓" : "") + '</span>' +
    '</button>';

  return (
    '<div class="options-popover" id="options-popover">' +
      '<div class="menu-label">Sort by</div>' +
      sortOption("title", "Title") +
      sortOption("author", "Author") +
      sortOption("added", "Newest") +
      '<div class="menu-separator"></div>' +
      '<div class="menu-label">Labels</div>' +
      toggleOption("title", "Title", showTitleLabel) +
      toggleOption("author", "Author", showAuthorLabel) +
      toggleOption("volume", "Volume Number", showVolume) +
    '</div>'
  );
}

function libraryMarkup(): string {
  const entries = libraryEntries();

  if (!entries.length) {
    return '<div class="empty-state">No books found</div>';
  }

  return (
    '<div class="library-grid">' +
      entries.map((entry) =>
        entry.type === "series"
          ? '<button class="cover-button" type="button" data-nav="series/' + entry.id + '" aria-label="Open ' + entry.title + '">' +
              seriesCover(entry.series) +
            '</button>'
          : '<button class="cover-button" type="button" data-reader="' + entry.id + '" aria-label="Open ' + entry.title + '">' +
              cover(entry.book) +
            '</button>'
      ).join("") +
    '</div>'
  );
}

function homePage(): string {
  return (
    '<main class="app-shell">' +
      header() +
      menuMarkup() +
      '<section class="continue-section" aria-label="Continue reading">' +
        '<div class="continue-track">' +
          continueBooks.slice(0, CONTINUE_LIMIT).map((book) => {
            const itemSeries = series.find((entry) => entry.volumeIds.includes(book.id));
            return (
              '<button class="cover-button" type="button" data-reader="' + book.id + '" aria-label="Continue ' + book.title + '">' +
                cover(book, "continue", itemSeries?.volumeIds.length) +
              '</button>'
            );
          }).join("") +
        '</div>' +
      '</section>' +
      '<section class="library-section">' +
        '<h2 class="section-title">Library</h2>' +
        '<div id="library-content">' + libraryMarkup() + '</div>' +
      '</section>' +
    '</main>'
  );
}

function backHeader(): string {
  return (
    '<header class="topbar">' +
      '<button class="back-button" type="button" data-back><span aria-hidden="true">‹</span> Books</button>' +
    '</header>'
  );
}

function seriesPage(id: string): string {
  const item = series.find((entry) => entry.id === id);
  if (!item) return homePage();

  const volumes = item.volumeIds
    .map((bookId) => books.find((book) => book.id === bookId))
    .filter((book): book is Book => Boolean(book));

  return (
    '<main class="app-shell">' +
      backHeader() +
      '<div class="page-heading"><h1>' + item.title + '</h1></div>' +
      '<div class="book-grid">' +
        volumes.map((book) =>
          '<button class="cover-button" type="button" data-reader="' + book.id + '" aria-label="Open ' + titleLine(book) + '">' +
            cover(book, "grid", volumes.length) +
          '</button>'
        ).join("") +
      '</div>' +
    '</main>'
  );
}

function readerPage(id: string): string {
  const book = books.find((item) => item.id === id);
  if (!book) return homePage();

  const page = book.page ?? 1;
  const pages = book.pages ?? 196;
  const percent = book.progress ?? page / pages;

  return (
    '<main class="reader-shell">' +
      '<header class="reader-topbar">' +
        '<button class="reader-back" type="button" data-back aria-label="Back"><span aria-hidden="true">‹</span></button>' +
        '<div class="reader-title"><strong>' + titleLine(book) + '</strong><span>' + book.author + '</span></div>' +
        '<button class="reader-more" type="button" aria-label="More options">•••</button>' +
      '</header>' +
      '<div class="reader-stage">' +
        '<div class="reader-page" style="--page-accent: ' + book.accent + '">' +
          '<span class="reader-page-shape reader-page-shape--one" aria-hidden="true"></span>' +
          '<span class="reader-page-shape reader-page-shape--two" aria-hidden="true"></span>' +
        '</div>' +
      '</div>' +
      '<footer class="reader-footer">' +
        '<div class="reader-progress"><span style="--progress: ' + Math.round(percent * 100) + '%"></span></div>' +
        '<div class="reader-status">Page ' + page + ' of ' + pages + '</div>' +
      '</footer>' +
    '</main>'
  );
}

function render(): void {
  const current = route();
  let markup = homePage();

  if (current.name === "series") markup = seriesPage(current.id);
  if (current.name === "reader") markup = readerPage(current.id);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = markup;
  wireInteractions();
}

function refreshLibrary(): void {
  const library = document.querySelector<HTMLDivElement>("#library-content");
  if (!library) return;
  library.innerHTML = libraryMarkup();
  wireEntryLinks(library);
}

function wireEntryLinks(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => navigate(element.dataset.nav ?? ""));
  });

  root.querySelectorAll<HTMLElement>("[data-reader]").forEach((element) => {
    element.addEventListener("click", () => navigate("reader/" + element.dataset.reader));
  });
}

function wireInteractions(): void {
  wireEntryLinks();

  document.querySelectorAll<HTMLElement>("[data-back]").forEach((element) => {
    element.addEventListener("click", () => history.back());
  });

  document.querySelector<HTMLInputElement>("#search-input")?.addEventListener("input", (event) => {
    searchQuery = (event.currentTarget as HTMLInputElement).value;
    refreshLibrary();
  });

  document.querySelector<HTMLButtonElement>("#open-menu")?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    render();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.sort as SortMode | undefined;
      if (mode) sortMode = mode;
      menuOpen = false;
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.setting === "title") {
        showTitleLabel = !showTitleLabel;
        localStorage.setItem("cloud-shelf-books:show-title", String(showTitleLabel));
      }

      if (button.dataset.setting === "author") {
        showAuthorLabel = !showAuthorLabel;
        localStorage.setItem("cloud-shelf-books:show-author", String(showAuthorLabel));
      }

      if (button.dataset.setting === "volume") {
        showVolume = !showVolume;
        localStorage.setItem("cloud-shelf-books:show-volume", String(showVolume));
      }

      render();
    });
  });
}

window.addEventListener("hashchange", () => {
  menuOpen = false;
  render();
});

render();
