BUNDLE_DIR = '/Users/yasaricli/Desktop/bundles';
STATUS_ALLOWED_VALUES = ['CREATED', 'PROGRESS', 'RUNNING', 'STOPPED'];

isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();
