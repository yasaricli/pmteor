Template.dashboard.helpers({
  apps() {
    return Applications.find();
  },

  logs() {
    return Logs.find();
  }
});
