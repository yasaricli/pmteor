Template.applications.helpers({
  apps() {
    return Applications.find({}, { ...SORT_FILTER });
  }
});

Template.updateApplicationModal.helpers({
  application() {
    return Applications.findOne(this._id);
  }
});
