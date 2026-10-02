import "./styles/app.css";
import { continueItems, shelves } from "./mock/library";
import type { ContentKind, ShelfItem } from "./types";

const labels: Record<ContentKind, string> = {
  book: "Read",
  music: "Listen",
  game: "Play",
  video: "Watch",
  document: "Open",
};

function coverMarkup(item: ShelfItem, size: "continue" | "shelf"): string {
  const progress =
    item.progress !== undefined
      ? `<span class="cover-progress" aria-hidden="true"><span style="--progress: ${Math.round(item.progress * 100)}%"></span></span>`
      : "";

  return `
    <button class="cover-card cover-card--${size} cover-card--${item.kind}" type="button" aria-label="${labels[item.kind]} ${item.title}">
      <span class="cover-art" style="--cover-accent: ${item.accent}">
        <span class="cover-mark" aria-hidden="true">${item.title.slice(0, 1)}</span>
        ${progress}
      </span>
      <span class="cover-title">${item.title}</span>
      ${item.subtitle ? `<span class="cover-subtitle">${item.subtitle}</span>` : ""}
    </button>
  `;
}

const continueMarkup = continueItems.map((item) => coverMarkup(item, "continue")).join("");

const shelvesMarkup = shelves
  .map(
    (shelf) => `
      <section class="shelf-section" aria-labelledby="shelf-${shelf.id}">
        <div class="shelf-heading">
          <div>
            <h2 class="shelf-title" id="shelf-${shelf.id}">${shelf.title}</h2>
            <span class="shelf-count">${shelf.count}</span>
          </div>
          <button class="shelf-more" type="button" aria-label="See all ${shelf.title}">See All</button>
        </div>
        <div class="shelf-track">
          ${shelf.items.map((item) => coverMarkup(item, "shelf")).join("")}
        </div>
      </section>
    `,
  )
  .join("");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <h1 class="brand">Cloud Shelf</h1>
      <button class="search-button" id="open-search" type="button" aria-label="Search library">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5"></circle>
          <path d="m16 16 4 4"></path>
        </svg>
      </button>
    </header>

    <section class="continue-section" aria-labelledby="continue-title">
      <div class="shelf-heading">
        <h2 class="shelf-title" id="continue-title">Continue</h2>
      </div>
      <div class="continue-track">
        ${continueMarkup}
      </div>
    </section>

    <div class="library-shelves">
      ${shelvesMarkup}
    </div>
  </main>

  <div class="search-overlay" id="search-overlay" hidden>
    <div class="search-panel">
      <div class="search-field">
        <input id="search-input" type="search" inputmode="search" placeholder="Search your library" aria-label="Search your library" />
        <button id="close-search" type="button">Done</button>
      </div>
    </div>
  </div>
`;

const overlay = document.querySelector<HTMLDivElement>("#search-overlay")!;
const input = document.querySelector<HTMLInputElement>("#search-input")!;

document.querySelector<HTMLButtonElement>("#open-search")!.addEventListener("click", () => {
  overlay.hidden = false;
  requestAnimationFrame(() => input.focus());
});

document.querySelector<HTMLButtonElement>("#close-search")!.addEventListener("click", () => {
  overlay.hidden = true;
  input.value = "";
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.hidden = true;
    input.value = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    overlay.hidden = true;
    input.value = "";
  }
});
