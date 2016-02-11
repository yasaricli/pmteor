Meteor.publish('applications', () => {
  return Applications.find({ });
});

Meteor.publish('application', (_id) => {
  return Applications.find({ _id });
});
