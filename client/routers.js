Router.route('/', {
  name: 'Index'
});

Router.route('/applications', {
  name: 'Applications',
  waitOn() {
    return Meteor.subscribe('applications');
  }
});

Router.route('/applications/create', {
  name: 'ApplicationCreate'
});
