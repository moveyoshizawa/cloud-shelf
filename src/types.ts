export type BindingDirection = "rtl" | "ltr";

export interface Book {
  id: string;
  title: string;
  author: string;
  volume?: number;
  label?: string;
  year?: number;
  added: string;
  progress?: number;
  page?: number;
  pages?: number;
  accent: string;
  binding: BindingDirection;
  hasCover: boolean;
}

export interface Series {
  id: string;
  title: string;
  volumeIds: string[];
}
