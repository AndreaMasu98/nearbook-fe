/* Questo file contiene le variabili di ambiente per la modalità di produzione. Qui puoi configurare le impostazioni specifiche per l'ambiente di produzione, come l'URL dell'API, il nome dell'applicazione, la versione e altre opzioni. Queste variabili saranno utilizzate durante la build dell'applicazione per sostituire i valori corrispondenti in tutto il codice. */
export const environment = {
  production: true,
  apiUrl: 'https://nearbook-be.onrender.com/api',
  appName: 'NearBook',
  appVersion: '1.0.0',
  enableAnalytics: true,
  enableLogging: false
};
