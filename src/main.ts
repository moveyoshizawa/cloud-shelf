import "./styles/app.css";
import { books, continueBooks, folders } from "./mock/library";
import type { Book, BookFolder } from "./types";

type Route =
  | { name: "home" }
  | { name: "all" }
  | { name: "folders" }
  | { name: "folder"; id: string }
  | { name: "recent" }
  | { name: "reader"; id: string };

function route(): Route {
  const hash = location.hash.replace(/^#\/?/, "");
  if (!hash) return { name: "home" };

  const [name, id] = hash.split("/");
  if (name === "all") return { name: "all" };
  if (name === "folders" && id) return { name: "folder", id };
  if (name === "folders") return { name: "folders" };
  if (name === "recent") return { name: "recent" };
  if (name === "reader" && id) return { name: "reader", id };
  return { name: "home" };
}

function navigate(path: string): void {
  location.hash = path;
}

function cover(book: Book, variant: "continue" | "grid" | "mini" = "grid"): string {
  const progress =
    book.progress !== undefined
      ? `<span class="cover-progress" aria-hidden="true"><span style="--progress: ${Math.round(book.progress * 100)}%"></span></span>`
      : "";

  return `
    <span class="book-cover book-cover--${variant}">
      <span class="book-art" style="--cover-accent: ${book.accent}">
        <span class="book-monogram" aria-hidden="true">${book.title.slice(0, 1)}</span>
        ${progress}
      </span>
      ${variant === "mini" ? "" : `
        <span class="book-title">${book.title}</span>
        ${book.author ? `<span class="book-meta">${book.author}</span>` : ""}
      `}
    </span>
  `;
}

function header(title = "Cloud Shelf Books", back?: string): string {
  return `
    <header class="topbar">
      ${back
        ? `<button class="back-button" type="button" data-nav="${back}"><span aria-hidden="true">‹</span> Library</button>`
        : `<div><div class="eyebrow">Cloud Shelf</div><h1 class="brand">${title.replace("Cloud Shelf ", "")}</h1></div>`}
      <button class="search-button" id="open-search" type="button" aria-label="Search books">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5"></circle>
          <path d="m16 16 4 4"></path>
        </svg>
      </button>
    </header>
  `;
}

function continueSection(): string {
  return `
    <section class="section continue-section" aria-labelledby="continue-title">
      <h2 class="section-title" id="continue-title">Continue Reading</h2>
      <div class="continue-track">
        ${continueBooks.map((book) => `
          <button class="cover-button" type="button" data-reader="${book.id}" aria-label="Continue reading ${book.title}">
            ${cover(book, "continue")}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function previewStack(bookIds: string[]): string {
  return bookIds
    .slice(0, 3)
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => Boolean(book))
    .map((book) => cover(book, "mini"))
    .join("");
}

function libraryEntrances(): string {
  return `
    <section class="section" aria-labelledby="library-title">
      <h2 class="section-title" id="library-title">Library</h2>
      <div class="library-list">
        <button class="library-row" type="button" data-nav="all">
          <span class="library-copy">
            <span class="library-title">All Books</span>
            <span class="library-subtitle">${books.length} books</span>
          </span>
          <span class="row-preview" aria-hidden="true">${previewStack(books.map((book) => book.id))}</span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
        <button class="library-row" type="button" data-nav="folders">
          <span class="library-copy">
            <span class="library-title">Folders</span>
            <span class="library-subtitle">Keep your existing organization</span>
          </span>
          <span class="folder-icon" aria-hidden="true">
            <span></span>
          </span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
        <button class="library-row" type="button" data-nav="recent">
          <span class="library-copy">
            <span class="library-title">Recently Added</span>
            <span class="library-subtitle">What just arrived</span>
          </span>
          <span class="recent-preview" aria-hidden="true">${previewStack(books.slice(0, 3).map((book) => book.id))}</span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  `;
}

function homePage(): string {
  return `
    <main class="app-shell">
      ${header()}
      ${continueSection()}
      ${libraryEntrances()}
    </main>
  `;
}

function bookGrid(title: string, subtitle: string, items: Book[]): string {
  return `
    <main class="app-shell">
      ${header(title, "")}
      <div class="page-heading">
        <h1>${title}</h1>
        <span>${subtitle}</span>
      </div>
      <div class="book-grid">
        ${items.map((book) => `
          <button class="cover-button" type="button" data-reader="${book.id}" aria-label="Open ${book.title}">
            ${cover(book)}
          </button>
        `).join("")}
      </div>
    </main>
  `;
}

function foldersPage(): string {
  return `
    <main class="app-shell">
      ${header("Folders", "")}
      <div class="page-heading">
        <h1>Folders</h1>
        <span>Your existing structure</span>
      </div>
      <div class="folder-list">
        ${folders.map((folder) => folderRow(folder)).join("")}
      </div>
    </main>
  `;
}

function folderRow(folder: BookFolder): string {
  return `
    <button class="folder-row" type="button" data-nav="folders/${folder.id}">
      <span class="folder-row-icon" aria-hidden="true"><span></span></span>
      <span class="folder-row-copy">
        <span class="folder-row-title">${folder.title}</span>
        <span class="folder-row-subtitle">${folder.subtitle}</span>
      </span>
      <span class="folder-row-stack" aria-hidden="true">${previewStack(folder.bookIds)}</span>
      <span class="chevron" aria-hidden="true">›</span>
    </button>
  `;
}

function folderPage(id: string): string {
  const folder = folders.find((item) => item.id === id);
  if (!folder) return homePage();
  const items = folder.bookIds
    .map((bookId) => books.find((book) => book.id === bookId))
    .filter((book): book is Book => Boolean(book));
  return bookGrid(folder.title, folder.subtitle, items);
}

function readerPage(id: string): string {
  const book = books.find((item) => item.id === id);
  if (!book) return homePage();
  const page = book.page ?? 1;
  const pages = book.pages ?? 196;
  const percent = book.progress ?? page / pages;

  return `
    <main class="reader-shell">
      <header class="reader-topbar">
        <button class="reader-back" type="button" data-back aria-label="Back">
          <span aria-hidden="true">‹</span>
        </button>
        <div class="reader-title">
          <strong>${book.title}</strong>
          <span>${book.author ?? "Book"}</span>
        </div>
        <button class="reader-more" type="button" aria-label="More options">•••</button>
      </header>

      <div class="reader-stage">
        <div class="reader-page" style="--page-accent: ${book.accent}">
          <span class="reader-page-number">${page}</span>
          <span class="reader-page-mark" aria-hidden="true">${book.title.slice(0, 1)}</span>
        </div>
      </div>

      <footer class="reader-footer">
        <div class="reader-progress">
          <span style="--progress: ${Math.round(percent * 100)}%"></span>
        </div>
        <div class="reader-status">Page ${page} of ${pages}</div>
      </footer>
    </main>
  `;
}

const searchMarkup = `
  <div class="search-overlay" id="search-overlay" hidden>
    <div class="search-panel">
      <div class="search-field">
        <input id="search-input" type="search" inputmode="search" placeholder="Search books" aria-label="Search books" />
        <button id="close-search" type="button">Done</button>
      </div>
      <p class="search-note">Search will cover titles and folders.</p>
    </div>
  </div>
`;

function render(): void {
  const current = route();
  let markup = homePage();

  if (current.name === "all") markup = bookGrid("All Books", `${books.length} books`, books);
  if (current.name === "folders") markup = foldersPage();
  if (current.name === "folder") markup = folderPage(current.id);
  if (current.name === "recent") markup = bookGrid("Recently Added", "Newest first", books.slice(0, 6));
  if (current.name === "reader") markup = readerPage(current.id);

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = markup + searchMarkup;
  wireInteractions();
}

function wireInteractions(): void {
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => navigate(element.dataset.nav ?? ""));
  });

  document.querySelectorAll<HTMLElement>("[data-reader]").forEach((element) => {
    element.addEventListener("click", () => navigate(`reader/${element.dataset.reader}`));
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

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay && input) {
      overlay.hidden = true;
      input.value = "";
    }
  });
}

window.addEventListener("hashchange", render);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const overlay = document.querySelector<HTMLDivElement>("#search-overlay");
  if (overlay && !overlay.hidden) {
    overlay.hidden = true;
    return;
  }

  if (route().name !== "home") history.back();
});

render();
