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

