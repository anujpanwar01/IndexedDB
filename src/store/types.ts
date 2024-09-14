export type db = {
  [e: string]: any;
} | null;

export type bookType = {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
  pageCount: number;
  publisher: string;
};
