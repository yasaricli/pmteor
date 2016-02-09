Meteor.publish('applications', () => {
  return Applications.find({ });
});
