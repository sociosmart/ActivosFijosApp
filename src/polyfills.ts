/***************************************************************************************************
 * Load `$localize` — used for internationalization.
 */

import '@angular/localize/init';

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// Soporte para navegadores antiguos como Android 7
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/***************************************************************************************************
 * Zone JS es requerido por Angular
 */
import 'zone.js';  // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */