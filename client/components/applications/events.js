Template.applications.events({
  'click .start'() {
    Meteor.call('start', this._id);
  },
  'click .stop'() {
    Meteor.call('stop', this._id);
  },
  'click .delete'() {
    Meteor.call('delete', this._id);
  },
  'click .absoluteUrl'(event) {
    event.preventDefault();
    window.open(this.absoluteUrl());
  }
});

Template.updateApplication.events({
  'click .stop'() {
    Meteor.call('stop', this._id);
  }
});
