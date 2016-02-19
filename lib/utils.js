EXEC_OPTIONS = {
  async: true,
  silent: true
};

STATUS_ALLOWED_VALUES = ['STOPPED', 'PROGRESS', 'ONLINE', 'READY', 'ERRORED'];

isClient = (callback) => Meteor.isClient && callback();
isServer = (callback) => Meteor.isServer && callback();
isLocal = () => !_.isEmpty(Meteor.absoluteUrl().match(/localhost/));


// if enf find properties.
hasEnv = (prop, callback) => { 
  if (_.has(process.env, prop)) {
    return callback(process.env[prop]);
  }
}
