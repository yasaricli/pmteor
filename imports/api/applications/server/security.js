import { Applications } from '../applications.js';

// if application member list search found then return.
Security.defineMethod("ifMembers", {
  fetch: [],
  transform: null,
  deny(type, arg, userId, doc, fields, modifier) {

    // IF UPDATED USER NOT MEMBER IDS THEN
    if (!_.contains(doc.memberIds, userId)) {
      return true;
    }
  }
});

Applications.permit(['insert', 'remove']).ifHasRole('admin').apply();
Applications.permit('update').ifLoggedIn().ifMembers().apply();
