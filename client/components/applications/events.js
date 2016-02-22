Template.applications.events({
  'click .start'() {
    Meteor.call('start', this._id);
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
  },
  'click .absoluteUrl'(event) {
    event.preventDefault();
    window.open(this.absoluteUrl());
  }
});
