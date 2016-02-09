isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();

STATUS_ALLOWED_VALUES = ['created', 'progress', 'running', 'stoped'];
