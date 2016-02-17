Template.applications.helpers({
  apps() {
    return Applications.find({}, {
      sort: {
        createdAt: -1
      }
    });
  }
});
