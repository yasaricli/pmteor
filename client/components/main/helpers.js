Template.index.helpers({
  applications() {
    return Applications.find();
  },

  logs() {
    return Logs.find();
  }
});
