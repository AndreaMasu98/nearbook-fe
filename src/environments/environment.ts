/* Questo file contiene le variabili di ambiente per la modalità di sviluppo. */
/* In produzione questo file viene sostituito da environment.prod.ts durante la build, grazie alla configurazione in angular.json. */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'NearBook',
  appVersion: '1.0.0',
  enableAnalytics: false,
  enableLogging: true
};
