Package.describe({
  name: 'pmteor:os',
  version: '0.0.1',
  summary: 'An operating-system utility library for meteor.',
  git: 'https://github.com/pmteor/meteor-os-utils.git',
  documentation: 'README.md'
});

Npm.depends({
  "os-utils": "0.0.14"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  // add file and export.
  api.addFiles('os.js', 'server');
  api.export('os');
});
