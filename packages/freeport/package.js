Package.describe({
  name: 'freeport',
  version: '0.0.1',
  summary: 'Find a free port.'
});

Npm.depends({
  "freeport": "1.0.5"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  // add file and export.
  api.addFiles('freeport.js', 'server');
  api.export('freeport');
});
