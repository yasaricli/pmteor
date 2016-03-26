Template.applications.helpers({
  apps() {
    return Applications.find({}, { ...SORT_FILTERS });
  }
});

Template.updateApplicationModal.helpers({
  application() {
    return Applications.findOne(this._id);
  }
});

Template.membersModal.inheritsHelpersFrom('updateApplicationModal');
