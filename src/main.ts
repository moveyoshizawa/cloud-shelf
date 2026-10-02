import "./styles/app.css";
import { books, continueBooks, newOnShelf, series } from "./mock/library";
import type { Book, Series } from "./types";

type Route =
  | { name: "home" }
  | { name: "series"; id: string }
  | { name: "all" }
  | { name: "reader"; id: string };

function route(): Route {
  const hash = location.hash.replace(/^#\\?\/?/, "").replace(/^#\/?/, "");
  if (!hash) return { name: "home" };
  const parts = hash.split("/");
  if (parts[0] === "series" && parts[1]) return { name: "series", id: parts[1] };
  if (parts[0] === "all") return { name: "all" };
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

function header(back = false): string {
  return (
    '<header class="topbar">' +
      (back
        ? '<button class="back-button" type="button" data-back><span aria-hidden="true">‹</span> Books</button>'
        : '<div><div class="eyebrow">Cloud Shelf</div><h1 class="brand">Books</h1></div>') +
      '<button class="search-button" id="open-search" type="button" aria-label="Search books">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<circle cx="11" cy="11" r="6.5"></circle>' +
          '<path d="m16 16 4 4"></path>' +
        '</svg>' +
      '</button>' +
    '</header>'
  );
}

function seriesVisual(item: Series): string {
  const volumeBooks = item.volumeIds
    .slice(0, 5)
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => Boolean(book));

  return (
    '<span class="series-visual" aria-hidden="true">' +
      volumeBooks.map((book, index) =>
        '<span class="series-volume" style="--series-accent: ' + book.accent + '; --series-index: ' + index + ';">' +
          '<span>' + (book.volume ?? index + 1) + '</span>' +
        '</span>'
      ).join("") +
    '</span>'
  );
}

function seriesCard(item: Series): string {
  return (
    '<button class="series-card" type="button" data-nav="series/' + item.id + '">' +
      seriesVisual(item) +
      '<span class="series-copy">' +
        '<span class="series-title">' + item.title + '</span>' +
        '<span class="series-meta">' + item.volumeIds.length + ' volumes</span>' +
      '</span>' +
    '</button>'
  );
}

function homePage(): string {
  return (
    '<main class="app-shell">' +
      header() +
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
        '<div class="section-heading">' +
          '<h2 class="section-title">Series</h2>' +
          '<button class="quiet-link" type="button" data-nav="all">See All</button>' +
        '</div>' +
        '<div class="series-grid">' +
          series.map(seriesCard).join("") +
        '</div>' +
      '</section>' +
      '<section class="section">' +
        '<h2 class="section-title">New on Shelf</h2>' +
        '<div class="new-track">' +
          newOnShelf.map((book) =>
            '<button class="cover-button" type="button" data-reader="' + book.id + '">' +
              cover(book, "grid") +
            '</button>'
          ).join("") +
        '</div>' +
      '</section>' +
    '</main>'
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
      header(true) +
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

function allPage(): string {
  return (
    '<main class="app-shell">' +
      header(true) +
      '<div class="page-heading">' +
        '<h1>Books</h1>' +
        '<span>' + books.length + ' books</span>' +
      '</div>' +
      '<div class="book-grid">' +
        books.map((book) =>
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

const searchMarkup =
  '<div class="search-overlay" id="search-overlay" hidden>' +
    '<div class="search-panel">' +
      '<div class="search-field">' +
        '<input id="search-input" type="search" inputmode="search" placeholder="Search" aria-label="Search books" />' +
        '<button id="close-search" type="button">Done</button>' +
      '</div>' +
    '</div>' +
  '</div>';

function render(): void {
  const current = route();
  let markup = homePage();

  if (current.name === "series") markup = seriesPage(current.id);
  if (current.name === "all") markup = allPage();
  if (current.name === "reader") markup = readerPage(current.id);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = markup + searchMarkup;
  wireInteractions();
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

  const overlay = document.querySelector<HTMLDivElement>("#search-overlay");
  const input = document.querySelector<HTMLInputElement>("#search-input");

  document.querySelector<HTMLButtonElement>("#open-search")?.addEventListener("click", () => {
    if (!overlay || !input) return;
    overlay.hidden = false;
    requestAnimationFrame(() => input.focus());
  });

  document.querySelector<HTMLButtonElement>("#close-search")?.addEventListener("click", () => {
    if (!overlay || !input) return;
    overlay.hidden = true;
    input.value = "";
  });
}

window.addEventListener("hashchange", render);
render();
