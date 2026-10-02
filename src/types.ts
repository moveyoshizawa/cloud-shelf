export type ContentKind = "book" | "music" | "game" | "video" | "document";

export interface ContinueItem {
  id: string;
  kind: ContentKind;
  title: string;
  subtitle: string;
  progress?: number;
  accent: string;
}

export interface LibrarySection {
  id: ContentKind;
  title: string;
  subtitle: string;
  count: number;
  accent: string;
}
