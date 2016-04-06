import { Applications } from '../applications.js';

Applications.permit(['insert', 'remove']).ifHasRole('admin').allowInClientCode();
Applications.permit('update').ifMember().allowInClientCode();
