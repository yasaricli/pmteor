class MorrisDev {
  constructor(type, options) {
    this._list = [];
    this._morris = new Morris[type](_.extend({
      data: this._list,
      xkey: 'hours',
      resize: true,
      parseTime: false,
      hideHover: 'auto'
    }, options));
  }

  add(doc) {

    // REMOVE LOADER CLASSES
    this._morris.el.removeClass('whirl ringed');

    // AND PUSH
    this._list.push(_.extend({
      createdAt: new Date(),
      hours: moment().format('HH:mm')
    }, doc));
  }

  reload() {
    this._morris.setData(this._list);
  }
}

MorrisChart = MorrisDev;
