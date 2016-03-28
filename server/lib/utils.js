// EMAILS LOAD
SSR.compileTemplate('log', Assets.getText('emails/log.html'));

// COLLECTION SECURTY ARGUMENTS
PERMIT_LIST_ALL = [ 'insert', 'update', 'remove' ];

// SECUR METHODS FUNCTION NAMES
METHODS = ['start', 'stop'];

// USERS FIELDS PUBLISH
USERS_FIELDS = {
  fields: {
    services: 0
  }
};

// if application member list search found then return.
Security.defineMethod("ifMemberAdmin", {
  fetch: [],
  transform: null,
  deny(type, arg, userId, doc, fields, modifier) {

    // IF UPDATED FIELD MEMBER THEN
    if (_.contains(fields, 'memberIds')) {

      // NOT ADMIN THEN DENY.
      if (!Roles.userIsInRole(userId, 'admin')) {
        return true;
      }
    }
  }
});
