Template.applications.onCreated(function() {
  this.subscribe('applications');
});

Template.application.onRendered(function() {
  const MemorySpark = new Sparkline({
    height: 100
  });
});

/*
Template.application.onDestroyed(function() {
  Meteor.clearInterval(this.processIntervalId);
});
*/
