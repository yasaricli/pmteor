const HELPERS = {
  isEqual(a, b) {
    return _.isEqual(a, b);
  }
};

_.each(HELPERS, (fn, name) => Blaze.Template.registerHelper(name, fn));
