Package.describe({
  name: 'pm2',
  version: '0.0.1',
  summary: 'Production process manager for Node.JS applications with a built-in load balancer.'
});

Npm.depends({
  "pm2": "1.0.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');

  // add file and export.
  api.addFiles('pm2.js', 'server');
  api.export('pm2');
});
