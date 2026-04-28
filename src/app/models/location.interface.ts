/* L'interfaccia Location rappresenta una posizione geografica con latitudine e longitudine. Viene utilizzata per tipizzare le coordinate geografiche in tutto il progetto, ad esempio per rappresentare la posizione di un libro o dell'utente. */
export interface Location {
  latitude: number;
  longitude: number;
}