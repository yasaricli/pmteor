Template.applications.onCreated(function() {
  this.subscribe('applications');
});

Template.application.onRendered(function() {
  const MemorySpark = new Sparkline({
    height: 100,
    tooltipCallback() {
      return filesize(this.y);
    }
  });

  this.processIntervalId = Meteor.setInterval(() => {
    const application = Applications.findOne(this.data._id);

    // ADD APPLICATION
    MemorySpark.add(application.monit.memory);

    // reload SPARKLINE
    MemorySpark.reload();
  }, 10000);
});

Template.application.onDestroyed(function() {

  // CLEAR INTERVAL
  Meteor.clearInterval(this.processIntervalId);
});
