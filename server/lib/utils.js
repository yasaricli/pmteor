// EMAILS LOAD
SSR.compileTemplate('log', Assets.getText('emails/log.html'));

// COLLECTION SECURTY ARGUMENTS
PERMIT_LIST_ALL = [ 'insert', 'update', 'remove' ];

// USERS FIELDS PUBLISH
USERS_FIELDS = {
  fields: {
    services: 0
  }
};

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
