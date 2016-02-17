Router.route('/', {
  name: 'Index',
  waitOn() {
    return Meteor.subscribe('applications');
  }
});
