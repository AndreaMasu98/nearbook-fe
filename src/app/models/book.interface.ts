/* L'interfaccia Book rappresenta la struttura dei dati di un libro all'interno dell'applicazione. Include proprietà come id, titolo, autore, anno, categoria, descrizione, percorsi per cover e thumbnail, disponibilità, numero di visualizzazioni, nome e cognome dell'utente che ha inserito il libro, e opzionalmente la distanza in metri e le coordinate geografiche (latitudine e longitudine) se disponibili. Questa interfaccia viene utilizzata per tipizzare i dati dei libri in tutto il progetto. */
export interface Book {
  id: number;
  titolo: string;
  autore: string;
  anno: number;
  categoria: string;
  descrizione: string;
  cover_path?: string;
  thumb_path?: string;
  disponibile: boolean;
  visualizzazioni: number;
  utente_nome: string;
  utente_cognome: string;
  distanza_metri?: number;
  latitudine?: number;
  longitudine?: number;
}

