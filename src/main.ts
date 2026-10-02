import "./styles/app.css";
import { continueItems, librarySections } from "./mock/library";
import type { ContentKind } from "./types";

const labels: Record<ContentKind, string> = {
  book: "Read",
  music: "Listen",
  game: "Play",
  video: "Watch",
  document: "Open",
};

const glyphs: Record<ContentKind, string> = {
  book: "B",
  music: "M",
  game: "G",
  video: "V",
  document: "F",
};

const continueMarkup = continueItems
  .map(
    (item) => `
      <button class="continue-card" type="button" aria-label="${labels[item.kind]} ${item.title}">
        <div class="card-art" style="--card-accent: ${item.accent}"></div>
        <div class="card-copy">
          <p class="card-kicker">${labels[item.kind]}</p>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-subtitle">${item.subtitle}</p>
        </div>
        ${
          item.progress !== undefined
            ? `<div class="progress" aria-hidden="true"><span style="--progress: ${Math.round(item.progress * 100)}%"></span></div>`
            : ""
        }
      </button>
    `,
  )
  .join("");

const libraryMarkup = librarySections
  .map(
    (section) => `
      <button class="library-row" type="button" aria-label="Open ${section.title}">
        <span class="library-icon" style="--row-accent: ${section.accent}">${glyphs[section.id]}</span>
        <span>
          <span class="library-title">${section.title}</span>
          <span class="library-subtitle">${section.subtitle}</span>
        </span>
        <span class="library-count">${section.count}<span class="chevron" aria-hidden="true">›</span></span>
      </button>
    `,
  )
  .join("");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <h1 class="brand">Cloud Shelf</h1>
      <button class="search-button" id="open-search" type="button" aria-label="Search library">Search</button>
    </header>

    <section class="section" aria-labelledby="continue-title">
      <div class="section-heading">
        <h2 class="section-title" id="continue-title">Continue</h2>
        <span class="section-note">Pick up where you left off</span>
      </div>
      <div class="continue-grid">
        ${continueMarkup}
      </div>
    </section>

    <section class="section" aria-labelledby="library-title">
      <div class="section-heading">
        <h2 class="section-title" id="library-title">Library</h2>
        <span class="section-note">Your files, by purpose</span>
      </div>
      <div class="library-list">
        ${libraryMarkup}
      </div>
    </section>
  </main>

  <div class="search-overlay" id="search-overlay" hidden>
    <div class="search-panel">
      <div class="search-field">
        <input id="search-input" type="search" inputmode="search" placeholder="Search your library" aria-label="Search your library" />
        <button id="close-search" type="button">Done</button>
      </div>
      <div class="search-hint">Search stays quiet until you need it.</div>
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
