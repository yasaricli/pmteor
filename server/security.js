// COLLECTIONFS BUNDLES PERMIT.
Security.permit(PERMIT_LIST_ALL).collections([Bundles]).ifHasRole('admin').apply();

// NEVER DOWNLOAD
Security.permit(['download']).collections([Bundles]).never().apply();
