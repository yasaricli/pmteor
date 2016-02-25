ASYNC_EXEC_OPTIONS = {
  async: true,
  silent: true
};

SYNC_EXEC_OPTIONS = {
  silent: true
};

STATUS_ALLOWED_VALUES = ['STOP', 'EXIT', 'ONLINE', 'READY', 'ERRORED', 'RESTART', 'RESTART OVERLIMIT'];

STATUS_MAPPER = {
  'STOP': STATUS_ALLOWED_VALUES[0],
  'EXIT': STATUS_ALLOWED_VALUES[1],
  'ONLINE': STATUS_ALLOWED_VALUES[2],
  'READY': STATUS_ALLOWED_VALUES[3],
  'ERRORED': STATUS_ALLOWED_VALUES[4],
  'RESTART': STATUS_ALLOWED_VALUES[2]
}

isClient = (callback) => Meteor.isClient && callback();
isServer = (callback) => Meteor.isServer && callback();
isLocal = () => !_.isEmpty(Meteor.absoluteUrl().match(/localhost/));


// if enf find properties.
hasEnv = (prop, callback) => { 
  if (_.has(process.env, prop)) {
    return callback(process.env[prop]);
  }
}
