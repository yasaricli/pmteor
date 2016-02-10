Template.applications.events({
  'click .start'() {
    Meteor.call('start', this._id, () => {
      console.log('Started');
    });
  },
  'click .delete'() {
    Applications.remove(this._id);
  }
});
