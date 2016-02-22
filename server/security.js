const PERMIT_LIST_ALL = [
  'insert',
  'update',
  'remove'
];

// APPLICATIONS PERMIT
Applications.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();

// LOGS PERMIT
Logs.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();

// BUNDLES PERMIT
Bundles.files.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();
