import { Logs } from '../logs.js';

Logs.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
