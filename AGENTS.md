# Cloud Shelf — Codex guide

## Product idea

Cloud Shelf is a content-first frontend for files that already belong to the user.

The prototype starts on the web for Safari/iPadOS. Proven interactions may later be rebuilt as a native SwiftUI app using Files, SwiftData, CloudKit, PDFKit, AVFoundation, and other Apple frameworks.

## Design principles

- High functionality, low apparent complexity.
- One primary purpose per screen.
- Prefer familiar iOS/iPadOS interaction patterns.
- Content is more important than controls.
- Hide advanced actions until they are needed.
- Use generous whitespace and strong visual hierarchy.
- Avoid dashboards, badges, metrics, settings, and decoration that do not help the current task.
- A first-time user should understand each screen without instructions.
- Keep cloud/storage mechanics quiet unless the user needs to act on them.
- Favor progressive disclosure: tap for the main action, long-press/context menus for secondary actions.
- Reuse the same interaction language across books, music, games, video, and documents.
- Files belong to the user. The app should add experience, not lock-in.

## Prototype constraints

- Keep the web prototype serverless and static.
- Prefer platform APIs and plain web capabilities over unnecessary dependencies.
- Do not add a framework without a clear product reason.
- Avoid premature abstractions.
- Accessibility and touch ergonomics are requirements, not polish.
- Target iPad Safari first, while remaining usable on iPhone and desktop browsers.
- Respect reduced-motion and light/dark appearance preferences.

## Current milestone

Build a calm, polished library shell with:

1. Continue
2. Library
3. Search

Data is mocked. No real cloud integration yet.

## Code style

- TypeScript, strict mode.
- Semantic HTML.
- CSS custom properties for design tokens.
- Small modules with clear names.
- No external UI component library in the prototype phase.
