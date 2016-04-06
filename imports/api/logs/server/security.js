import { Logs } from '../logs.js';

// INSERT AND REMOVE PERMIT
Logs.permit(['insert', 'remove']).ifLoggedIn().allowInClientCode();

// NEVER UPDATE
Logs.permit('update').never().allowInClientCode();
