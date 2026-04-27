import { Book } from "./book.interface";

export interface BookDetail extends Book {
  lat: number;
  lng: number;
}