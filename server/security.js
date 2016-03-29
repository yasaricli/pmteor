// INSERT AND REMOVE HAS ROLE ADMIN THEN
Applications.permit(['insert', 'remove']).ifHasRole('admin').apply();

// UPDATE IS MEMBER LIST THEN.
Applications.permit('update').ifLoggedIn().ifMembers().apply();
Logs.permit(PERMIT_LIST_ALL).ifLoggedIn().apply();

// COLLECTIONFS BUNDLES PERMIT.
Security.permit(PERMIT_LIST_ALL).collections([Bundles]).ifHasRole('admin').apply();

// NEVER DOWNLOAD
Security.permit(['download']).collections([Bundles]).never().apply();
