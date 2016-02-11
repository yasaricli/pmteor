BUNDLE_DIR = '/Users/yasaricli/Desktop/bundles';

EXEC_OPTIONS = {
  async: true,
  silent: true
};

STATUS_ALLOWED_VALUES = ['STOPPED', 'PROGRESS', 'ONLINE', 'READY', 'ERRORED'];

/*
 * In general, since Meteor is built on top of Node.js, getting and setting
 * of environment variables is via process.env
 */
ENVIRONMENT_VARIABLES = [
  'MONGO_URL',
  'ROOT_URL',
  'DISABLE_WEBSOCKETS',
  'MONGO_OPLOG_URL',
  'MAIL_URL'
];

isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();
