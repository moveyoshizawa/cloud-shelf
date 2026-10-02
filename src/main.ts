import "./styles/app.css";
import { books, continueBooks, series, standaloneBooks } from "./mock/library";
import type { Book, Series } from "./types";

type Route =
  | { name: "home" }
  | { name: "series"; id: string }
  | { name: "reader"; id: string };

type SortMode = "title" | "added" | "progress";

type LibraryEntry =
  | { type: "series"; id: string; title: string; series: Series; displayBook: Book }
  | { type: "book"; id: string; title: string; book: Book; displayBook: Book };

let searchQuery = "";
let sortMode: SortMode = "title";
let sortOpen = false;
let searchOpen = false;

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

function bookLabel(book: Book): string {
  if (book.volume) return "Vol. " + book.volume;
  return book.label ?? "";
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

function cover(book: Book, variant: "continue" | "grid" = "grid"): string {
  const progress = book.progress !== undefined
    ? '<span class="cover-progress" aria-hidden="true"><span style="--progress: ' + Math.round(book.progress * 100) + '%"></span></span>'
    : "";

  return (
    '<span class="book-cover book-cover--' + variant + '">' +
      '<span class="book-art" style="--cover-accent: ' + book.accent + '">' +
        '<span class="book-monogram" aria-hidden="true">' + book.title.slice(0, 1) + '</span>' +
        (book.volume ? '<span class="volume-mark" aria-hidden="true">' + book.volume + '</span>' : '') +
        progress +
      '</span>' +
      '<span class="book-title">' + book.title + '</span>' +
      '<span class="book-meta">' + bookLabel(book) + '</span>' +
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
      '<span class="series-back series-back--' + (index + 1) + '" style="--cover-accent: ' + book.accent + '"></span>'
    )
    .join("");

  const progress = front.progress !== undefined
    ? '<span class="cover-progress" aria-hidden="true"><span style="--progress: ' + Math.round(front.progress * 100) + '%"></span></span>'
    : "";

  return (
    '<span class="stacked-book">' +
      '<span class="stack-art-wrap">' +
        backs +
        '<span class="book-art stack-front" style="--cover-accent: ' + front.accent + '">' +
          '<span class="book-monogram" aria-hidden="true">' + front.title.slice(0, 1) + '</span>' +
          (front.volume ? '<span class="volume-mark" aria-hidden="true">' + front.volume + '</span>' : '') +
          progress +
        '</span>' +
      '</span>' +
      '<span class="book-title">' + item.title + '</span>' +
      '<span class="book-meta">' + item.volumeIds.length + ' volumes</span>' +
    '</span>'
  );
}

function header(): string {
  if (searchOpen) {
    return (
      '<header class="search-topbar">' +
        '<div class="inline-search">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<circle cx="11" cy="11" r="6.5"></circle>' +
            '<path d="m16 16 4 4"></path>' +
          '</svg>' +
          '<input id="inline-search-input" type="search" inputmode="search" placeholder="Search books" value="' + searchQuery.replace(/"/g, "&quot;") + '" aria-label="Search books" />' +
        '</div>' +
        '<button class="cancel-search" id="close-search" type="button">Cancel</button>' +
      '</header>'
    );
  }

  return (
    '<header class="topbar">' +
      '<div><div class="eyebrow">Cloud Shelf</div><h1 class="brand">Books</h1></div>' +
      '<div class="top-actions">' +
        '<button class="icon-button" id="open-search" type="button" aria-label="Search books">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<circle cx="11" cy="11" r="6.5"></circle>' +
            '<path d="m16 16 4 4"></path>' +
          '</svg>' +
        '</button>' +
        '<button class="icon-button more-button" id="open-sort" type="button" aria-label="Sort books">•••</button>' +
      '</div>' +
    '</header>'
  );
}

function libraryEntries(): LibraryEntry[] {
  const groupedIds = new Set(series.flatMap((item) => item.volumeIds));
  const entries: LibraryEntry[] = [
    ...series.map((item) => ({
      type: "series" as const,
      id: item.id,
      title: item.title,
      series: item,
      displayBook: activeVolume(item),
    })),
    ...standaloneBooks
      .filter((book) => !groupedIds.has(book.id))
      .map((book) => ({
        type: "book" as const,
        id: book.id,
        title: book.title,
        book,
        displayBook: book,
      })),
  ];

  const query = searchQuery.trim().toLocaleLowerCase();
  const filtered = query
    ? entries.filter((entry) => {
        const extra = entry.type === "series"
          ? entry.series.volumeIds.length + " volumes vol " + (entry.displayBook.volume ?? "")
          : bookLabel(entry.book);
        return (entry.title + " " + extra).toLocaleLowerCase().includes(query);
      })
    : entries;

  return filtered.sort((a, b) => {
    if (sortMode === "title") return a.title.localeCompare(b.title);

    if (sortMode === "progress") {
      const aProgress = a.displayBook.progress ?? -1;
      const bProgress = b.displayBook.progress ?? -1;
      return bProgress - aProgress || a.title.localeCompare(b.title);
    }

    const rank = (value: string): number => value === "Today" ? 0 : value === "Yesterday" ? 1 : 2;
    return rank(a.displayBook.added) - rank(b.displayBook.added) || a.title.localeCompare(b.title);
  });
}

function sortMenu(): string {
  if (!sortOpen) return "";

  const option = (mode: SortMode, label: string) =>
    '<button class="sort-option' + (sortMode === mode ? ' sort-option--active' : '') + '" type="button" data-sort="' + mode + '">' +
      '<span>' + label + '</span>' +
      '<span class="sort-check" aria-hidden="true">' + (sortMode === mode ? "✓" : "") + '</span>' +
    '</button>';

  return (
    '<div class="sort-popover" id="sort-popover">' +
      option("title", "Title") +
      option("added", "Recently Added") +
      option("progress", "Reading Progress") +
    '</div>'
  );
}

function homePage(): string {
  const entries = libraryEntries();

  return (
    '<main class="app-shell">' +
      header() +
      sortMenu() +
      '<section class="section">' +
        '<h2 class="section-title">Continue Reading</h2>' +
        '<div class="continue-track">' +
          continueBooks.map((book) =>
            '<button class="cover-button" type="button" data-reader="' + book.id + '">' +
              cover(book, "continue") +
            '</button>'
          ).join("") +
        '</div>' +
      '</section>' +
      '<section class="section">' +
        '<h2 class="section-title">Library</h2>' +
        (entries.length
          ? '<div class="library-grid">' +
              entries.map((entry) =>
                entry.type === "series"
                  ? '<button class="cover-button" type="button" data-nav="series/' + entry.id + '">' + seriesCover(entry.series) + '</button>'
                  : '<button class="cover-button" type="button" data-reader="' + entry.id + '">' + cover(entry.book) + '</button>'
              ).join("") +
            '</div>'
          : '<div class="empty-state">No books found</div>') +
      '</section>' +
    '</main>'
  );
}

function backHeader(): string {
  return (
    '<header class="topbar">' +
      '<button class="back-button" type="button" data-back><span aria-hidden="true">‹</span> Books</button>' +
      '<div class="top-actions">' +
        '<button class="icon-button" id="open-search" type="button" aria-label="Search books">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<circle cx="11" cy="11" r="6.5"></circle>' +
            '<path d="m16 16 4 4"></path>' +
          '</svg>' +
        '</button>' +
      '</div>' +
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
      '<div class="page-heading">' +
        '<h1>' + item.title + '</h1>' +
        '<span>' + volumes.length + ' volumes</span>' +
      '</div>' +
      '<div class="book-grid">' +
        volumes.map((book) =>
          '<button class="cover-button" type="button" data-reader="' + book.id + '">' +
            cover(book) +
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
        '<div class="reader-title"><strong>' + book.title + '</strong><span>' + bookLabel(book) + '</span></div>' +
        '<button class="reader-more" type="button" aria-label="More options">•••</button>' +
      '</header>' +
      '<div class="reader-stage">' +
        '<div class="reader-page" style="--page-accent: ' + book.accent + '">' +
          '<span class="reader-page-number">' + page + '</span>' +
          '<span class="reader-page-mark" aria-hidden="true">' + book.title.slice(0, 1) + '</span>' +
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

  if (searchOpen) {
    const input = document.querySelector<HTMLInputElement>("#inline-search-input");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

function wireInteractions(): void {
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => navigate(element.dataset.nav ?? ""));
  });

  document.querySelectorAll<HTMLElement>("[data-reader]").forEach((element) => {
    element.addEventListener("click", () => navigate("reader/" + element.dataset.reader));
  });

  document.querySelectorAll<HTMLElement>("[data-back]").forEach((element) => {
    element.addEventListener("click", () => history.back());
  });

  document.querySelector<HTMLButtonElement>("#open-search")?.addEventListener("click", () => {
    searchOpen = true;
    sortOpen = false;
    render();
  });

  document.querySelector<HTMLButtonElement>("#close-search")?.addEventListener("click", () => {
    searchOpen = false;
    searchQuery = "";
    render();
  });

  document.querySelector<HTMLInputElement>("#inline-search-input")?.addEventListener("input", (event) => {
    searchQuery = (event.currentTarget as HTMLInputElement).value;
    const entries = libraryEntries();
    const grid = document.querySelector<HTMLElement>(".library-grid");
    const empty = document.querySelector<HTMLElement>(".empty-state");

    const markup = entries.map((entry) =>
      entry.type === "series"
        ? '<button class="cover-button" type="button" data-nav="series/' + entry.id + '">' + seriesCover(entry.series) + '</button>'
        : '<button class="cover-button" type="button" data-reader="' + entry.id + '">' + cover(entry.book) + '</button>'
    ).join("");

    if (grid) {
      grid.innerHTML = markup;
      wireLibraryLinks(grid);
    } else if (entries.length && empty) {
      empty.outerHTML = '<div class="library-grid">' + markup + '</div>';
      const newGrid = document.querySelector<HTMLElement>(".library-grid");
      if (newGrid) wireLibraryLinks(newGrid);
    } else if (!entries.length && grid) {
      grid.outerHTML = '<div class="empty-state">No books found</div>';
    }
  });

  document.querySelector<HTMLButtonElement>("#open-sort")?.addEventListener("click", () => {
    sortOpen = !sortOpen;
    render();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.sort as SortMode | undefined;
      if (mode) sortMode = mode;
      sortOpen = false;
      render();
    });
  });
}

function wireLibraryLinks(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => navigate(element.dataset.nav ?? ""));
  });

  root.querySelectorAll<HTMLElement>("[data-reader]").forEach((element) => {
    element.addEventListener("click", () => navigate("reader/" + element.dataset.reader));
  });
}

window.addEventListener("hashchange", () => {
  searchOpen = false;
  sortOpen = false;
  searchQuery = "";
  render();
});

render();
