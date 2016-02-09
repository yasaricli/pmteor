Package.describe({
  name: 'shell',
  version: '0.0.1',
  summary: 'Portable Unix shell commands for Node.js'
});

Npm.depends({
  "shelljs": "0.6.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');

  // add file and export.
  api.addFiles('shell.js', 'server');
  api.export('shell');
});
