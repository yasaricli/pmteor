BUNDLE_DIR = '/Users/yasaricli/Desktop/bundles';
STATUS_ALLOWED_VALUES = ['STOPPED', 'PROGRESS', 'RUNNING', 'READY'];

isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();
