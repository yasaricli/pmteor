Template.applications.events({
  'click .start'() {
    Meteor.call('start', this._id, () => {
      
    });
  }
});
