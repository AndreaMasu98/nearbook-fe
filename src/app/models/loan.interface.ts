export interface Loan {
  id: number;
  libro_id: number;
  richiedente_id: number;
  stato: 'pendente' | 'accettata' | 'rifiutata';
  messaggio?: string;
  creato_il: string;
  titolo: string;
  autore: string;
  richiedente_nome: string;
  richiedente_cognome: string;
}