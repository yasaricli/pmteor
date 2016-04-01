class Chart {
  constructor(type, options) {
    this._list = [];
    this._morris = new Morris[type](_.extend({
      data: this._list,
      xkey: 'time',
      resize: true,
      parseTime: false,
      hideHover: 'auto'
    }, options));
  }

  add(doc) {

    // REMOVE LOADER CLASSES
    this._morris.el.removeClass('whirl ringed no-overlay');

    if (_.isEqual(this._list.length, 10)) {
      this._list.shift();
    }

    // AND PUSH
    this._list.push(_.defaults({
      createdAt: new Date(),
      time: moment().format('HH:mm')
    }, doc));
  }

  reload() {
    this._morris.setData(this._list);
  }
}

export class MorrisLineArea {
  constructor() {
    this._instance = Template.instance();

    this.memory = new Chart('Line', {
      element: this._instance.$('#morris-memory'),
      ykeys: ['value'],
      labels: ["Memory"],
      lineColors: ["#31C0BE"],
      lineWidth: 5,
      pointSize: 6,
      pointFillColors: ['#37a3a2'],
      pointStrokeColors: ['#37a3a2'],
      hoverCallback(index, options, content, row) {
        const from = moment(row.createdAt).fromNow();
        return `${from}<br/><b>${row.value} ${row.suffix}</b>`;
      }
    });

    this.cpu = new Chart('Area', {
      element: this._instance.$('#morris-cpu'),
      ykeys: ['cpu'],
      labels: ["Cpu"],
      lineColors: ["#7266ba"],
      lineWidth: 5,
      pointSize: 6,
      pointFillColors: ['#685abb'],
      pointStrokeColors: ['#685abb'],
      hoverCallback(index, options, content, row) {
        const from = moment(row.createdAt).fromNow();
        return `${from}<br/><b>${row.cpu} %</b>`;
      }
    });
  }

  reload() {
    this.memory.reload();
    this.cpu.reload();
  }

  add(monit) {
    this.cpu.add({ cpu: monit.cpu });
    this.memory.add(filesize(monit.memory, { output: 'object' }));
  }
}
