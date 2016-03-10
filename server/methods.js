Meteor.methods({
  start(_id) {
    const application = Applications.findOne(_id);

    // START
    application.start();
  },

  stop(_id) {
    const application = Applications.findOne(_id);

    // STOP
    application.stop();
  },

  destroy(_id) {
    const application = Applications.findOne(_id);

    // DESTROY
    application.destroy();
  }
});
