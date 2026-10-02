export interface Book {
  id: string;
  title: string;
  author?: string;
  folder: string;
  added: string;
  progress?: number;
  page?: number;
  pages?: number;
  accent: string;
}

export interface BookFolder {
  id: string;
  title: string;
  subtitle: string;
  bookIds: string[];
}
