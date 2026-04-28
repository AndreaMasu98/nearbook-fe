/* L'interfaccia User rappresenta la struttura dei dati di un utente all'interno dell'applicazione. Include proprietà come id, nome, cognome ed email. Questa interfaccia viene utilizzata per tipizzare i dati degli utenti in tutto il progetto. */
export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
}