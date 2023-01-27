// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlAPI: "https://api-prueba-ck9m.onrender.com",
  UrlConsultaDocumento: "http://tinaymar-001-site3.ctempurl.com/api/Consulta",
  IGV: 18, //se puede cambiar el IGV en el futuro por lo que se deja como variable de entorno para que sea facil de cambiar en un futuro
  //variable de inicio
  saleTypeOperation: 2, //01: Factura, 02: Boleta
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
