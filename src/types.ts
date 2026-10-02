export type ContentKind = "book" | "music" | "game" | "video" | "document";

export interface ShelfItem {
  id: string;
  kind: ContentKind;
  title: string;
  subtitle?: string;
  progress?: number;
  accent: string;
}

export interface ShelfSection {
  id: ContentKind;
  title: string;
  count: number;
  items: ShelfItem[];
}
