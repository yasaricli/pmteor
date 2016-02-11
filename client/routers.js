Router.route('/', {
  name: 'Index'
});

Router.route('/applications', {
  name: 'Applications',
  waitOn() {
    return Meteor.subscribe('applications');
  }
});

Router.route('/applications/:_id', {
  name: 'Application',
  waitOn() {
    return Meteor.subscribe('application', this.params._id);
  },
  data() {
    return Applications.findOne(this.params._id);
  }
});

Router.route('/insert', {
  name: 'Insert'
});
