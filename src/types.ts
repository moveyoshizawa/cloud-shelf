export interface Book {
  id: string;
  title: string;
  volume?: number;
  label?: string;
  added: string;
  progress?: number;
  page?: number;
  pages?: number;
  accent: string;
}

export interface Series {
  id: string;
  title: string;
  volumeIds: string[];
}
