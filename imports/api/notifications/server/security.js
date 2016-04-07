import { Notifications } from '../notifications.js';


// NEVER CLIENT EVENTS.
Notifications.permit(['insert', 'remove', 'update']).never().allowInClientCode();
