EXEC_OPTIONS = {
  async: true,
  silent: true
};

STATUS_ALLOWED_VALUES = ['STOPPED', 'PROGRESS', 'ONLINE', 'READY', 'ERRORED'];

isServer = (callback) => Meteor.isServer && callback();
isClient = (callback) => Meteor.isClient && callback();


/*
 * if LOG ENV 1 THEN Show log.
 */
log = (color, l) => {
  if (_.has(process.env, 'LOG')) {
    if (_.isEqual(process.env.LOG, '1')) {
      console.log(chalk.red('#||||||||||||||||||||||||||||||||||||||||||||||#'));
      console.log(chalk.yellow.bold('------- LOG -------'));
      console.log(color(l));
      console.log(chalk.yellow.bold('----- END LOG -----'));
      console.log(chalk.red('#||||||||||||||||||||||||||||||||||||||||||||||#\n'));
    }
  }
}
