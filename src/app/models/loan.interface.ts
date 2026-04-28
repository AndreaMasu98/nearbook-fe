/* L'interfaccia Loan rappresenta la struttura dei dati di un prestito all'interno dell'applicazione. Include proprietà come id, libro_id, richiedente_id, stato del prestito (pendente, accettata o rifiutata), messaggio opzionale, data di creazione, titolo e autore del libro, e nome e cognome del richiedente. Questa interfaccia viene utilizzata per tipizzare i dati dei prestiti in tutto il progetto. */
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