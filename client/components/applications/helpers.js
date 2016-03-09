Template.applications.helpers({
  apps() {
    return Applications.find({}, {
      sort: {
        createdAt: -1
      }
    });
  }
});

Template.updateApplicationModal.helpers({
  application() {
    return Applications.findOne(this._id);
  }
});
