EXEC_OPTIONS = {
  async: true,
  silent: true
};

STATUS_ALLOWED_VALUES = ['STOPPED', 'PROGRESS', 'ONLINE', 'READY', 'ERRORED'];

isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();
isLocal = () => !_.isEmpty(Meteor.absoluteUrl().match(/localhost/));
