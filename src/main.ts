import "./styles/app.css";
import { continueItems, shelves } from "./mock/library";
import type { ContentKind, ShelfItem, ShelfSection } from "./types";

const labels: Record<ContentKind, string> = {
  book: "Read",
  music: "Listen",
  game: "Play",
  video: "Watch",
  document: "Open",
};

function coverMarkup(item: ShelfItem, size: "continue" | "grid" | "preview"): string {
  const progress =
    item.progress !== undefined
      ? `<span class="cover-progress" aria-hidden="true"><span style="--progress: ${Math.round(item.progress * 100)}%"></span></span>`
      : "";

  const title = size === "preview" ? "" : `<span class="cover-title">${item.title}</span>`;
  const subtitle =
    size !== "preview" && item.subtitle
      ? `<span class="cover-subtitle">${item.subtitle}</span>`
      : "";

  return `
    <span class="cover-card cover-card--${size} cover-card--${item.kind}">
      <span class="cover-art" style="--cover-accent: ${item.accent}">
        <span class="cover-mark" aria-hidden="true">${item.title.slice(0, 1)}</span>
        ${progress}
      </span>
      ${title}
      ${subtitle}
    </span>
  `;
}

function categoryCardMarkup(shelf: ShelfSection): string {
  const previews = shelf.items.slice(0, 3).map((item) => coverMarkup(item, "preview")).join("");

  return `
    <button class="category-card" type="button" data-category="${shelf.id}" aria-label="Open ${shelf.title}">
      <span class="category-copy">
        <span class="category-title">${shelf.title}</span>
        <span class="category-meta">${shelf.count} items</span>
      </span>
      <span class="cover-stack" aria-hidden="true">
        ${previews}
      </span>
      <span class="category-chevron" aria-hidden="true">›</span>
    </button>
  `;
}

function renderHome(): string {
  const continueMarkup = continueItems
    .map(
      (item) => `
        <button class="continue-item" type="button" aria-label="${labels[item.kind]} ${item.title}">
          ${coverMarkup(item, "continue")}
        </button>
      `,
    )
    .join("");

  return `
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
        <h2 class="section-title" id="continue-title">Continue</h2>
        <div class="continue-track">
          ${continueMarkup}
        </div>
      </section>

      <section class="library-section" aria-labelledby="library-title">
        <h2 class="section-title" id="library-title">Library</h2>
        <div class="category-grid">
          ${shelves.map(categoryCardMarkup).join("")}
        </div>
      </section>
    </main>
  `;
}

function renderShelf(shelf: ShelfSection): string {
  return `
    <main class="app-shell shelf-page">
      <header class="shelf-topbar">
        <button class="back-button" id="back-home" type="button" aria-label="Back to Library">
          <span aria-hidden="true">‹</span> Library
        </button>
        <button class="search-button" id="open-search" type="button" aria-label="Search ${shelf.title}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5"></circle>
            <path d="m16 16 4 4"></path>
          </svg>
        </button>
      </header>

      <div class="shelf-page-heading">
        <h1>${shelf.title}</h1>
        <span>${shelf.count} items</span>
      </div>

      <div class="content-grid">
        ${shelf.items
          .map(
            (item) => `
              <button class="content-item" type="button" aria-label="${labels[item.kind]} ${item.title}">
                ${coverMarkup(item, "grid")}
              </button>
            `,
          )
          .join("")}
      </div>
    </main>
  `;
}

const searchMarkup = `
  <div class="search-overlay" id="search-overlay" hidden>
    <div class="search-panel">
      <div class="search-field">
        <input id="search-input" type="search" inputmode="search" placeholder="Search your library" aria-label="Search your library" />
        <button id="close-search" type="button">Done</button>
      </div>
    </div>
  </div>
`;

function currentShelf(): ShelfSection | undefined {
  const id = location.hash.replace("#", "") as ContentKind;
  return shelves.find((shelf) => shelf.id === id);
}

function render(): void {
  const shelf = currentShelf();
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = (shelf ? renderShelf(shelf) : renderHome()) + searchMarkup;
  wireInteractions();
}

function wireInteractions(): void {
  const overlay = document.querySelector<HTMLDivElement>("#search-overlay")!;
  const input = document.querySelector<HTMLInputElement>("#search-input")!;

  document.querySelector<HTMLButtonElement>("#open-search")?.addEventListener("click", () => {
    overlay.hidden = false;
    requestAnimationFrame(() => input.focus());
  });

  document.querySelector<HTMLButtonElement>("#close-search")?.addEventListener("click", () => {
    overlay.hidden = true;
    input.value = "";
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.hidden = true;
      input.value = "";
    }
  });

  document.querySelectorAll<HTMLButtonElement>(".category-card").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = button.dataset.category ?? "";
    });
  });

  document.querySelector<HTMLButtonElement>("#back-home")?.addEventListener("click", () => {
    history.pushState(null, "", location.pathname + location.search);
    render();
  });
}

window.addEventListener("hashchange", render);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const overlay = document.querySelector<HTMLDivElement>("#search-overlay");
    if (overlay && !overlay.hidden) {
      overlay.hidden = true;
      const input = document.querySelector<HTMLInputElement>("#search-input");
      if (input) input.value = "";
      return;
    }

    if (currentShelf()) {
      history.pushState(null, "", location.pathname + location.search);
      render();
    }
  }
});

render();
