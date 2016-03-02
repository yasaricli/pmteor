Template.applications.onCreated(function() {
  this.subscribe('applications');
});

Template.application.onRendered(function() {
  const memory = new MorrisChart('Line', {
    element: this.$('#morris-memory'),
    ykeys: ['value'],
    labels: ["Memory"],
    lineColors: ["#31C0BE"],
    hoverCallback(index, options, content, row) {
      const from = moment(row.createdAt).fromNow();
      return `${from}<br/><b>${row.value} ${row.suffix}</b>`;
    }
  });

  const cpu = new MorrisChart('Area', {
    element: this.$('#morris-cpu'),
    ykeys: ['cpu'],
    labels: ["Cpu"],
    lineColors: ["#7266ba"],
    hoverCallback(index, options, content, row) {
      const from = moment(row.createdAt).fromNow();
      return `${from}<br/><b>${row.cpu} %</b>`;
    }
  });

  this.cursor = Applications.find(this.data._id).observe({
    changed(doc) {

      // IS ONLINE THEN
      if (_.isEqual(doc.status, STATUS_ALLOWED_VALUES[2])) {

        // PUSH NEW MEMORY AND CPU
        memory.add(filesize(doc.monit.memory, { output: 'object' }));

        cpu.add({ cpu: doc.monit.cpu });

        // AND RELOAD
        memory.reload();
        cpu.reload();
      }
    }
  });
});

Template.application.onDestroyed(function() {

  // CURSOR OBSERVE SROP
  this.cursor.stop();
});
