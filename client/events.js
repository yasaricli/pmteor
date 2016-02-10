Template.applications.events({
  'click .start'() {
    Meteor.call('start', this._id, () => {
      console.log('Started');
    });
  },
  'click .stop'() {
    Applications.update(this._id, {
      $set: {
        status: STATUS_ALLOWED_VALUES[0]
      }
    });
  },
  'click .delete'() {
    Applications.remove(this._id);
  }
});
