// Security.defineMethod(name, definition)

// if application member list search found then return.
Security.defineMethod("ifMember", {
  fetch: [],
  transform: null,
  allow(type, field, userId, doc) {

    // IF UPDATED USER NOT MEMBER IDS THEN
    return _.contains(doc.memberIds, userId);
  }
});
