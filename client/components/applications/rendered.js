Template.applications.onCreated(function() {
  this.subscribe('applications');
});

Template.application.onRendered(function() {
  const MemorySpark = new Sparkline({
    width: 'auto',
    height: 100,
    lineColor: '#878c9a',
    highlightLineColor: '#878c9a',
    fillColor: '#bbbec6',
    spotColor: '#878c9a',
    highlightSpotColor: '#878c9a',
    spotRadius: 4,
    lineWidth: 3,
    drawNormalOnTop: true,

    highlightColor: '#878c9a',

    // TOOLTIP CALLBACO RETURN STRING.
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
  }, 1000);
});

Template.application.onDestroyed(function() {

  // CLEAR INTERVAL
  Meteor.clearInterval(this.processIntervalId);
});
