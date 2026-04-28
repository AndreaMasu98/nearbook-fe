import { Book } from "./book.interface";

/* L'interfaccia BookDetail estende l'interfaccia Book aggiungendo le proprietà latitudine e longitudine, che rappresentano la posizione del libro. Questa interfaccia viene utilizzata per rappresentare i dettagli di un libro, inclusa la sua posizione geografica. */
/* Ho dovuto creare questa interfaccia separata perché i BookDetail includono informazioni aggiuntive (latitudine e longitudine) che non sono presenti nell'interfaccia Book, che rappresenta solo le informazioni di base del libro. */
export interface BookDetail extends Book {
  lat: number;
  lng: number;
}