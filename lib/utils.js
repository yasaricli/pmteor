BUNDLE_DIR = '/Users/yasaricli/Desktop/bundles';
STATUS_ALLOWED_VALUES = ['STOPPED', 'PROGRESS', 'RUNNING'];

isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();
