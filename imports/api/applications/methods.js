import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Applications } from './applications.js';

const hasApplicationMixin = (options) => {
  options.validate = function({ _id }) {
    check(_id, String);

    // GET APPLICATION
    const application = Applications.findOne({ _id, memberIds: this.userId });

    // if application undefined then throw error 404.
    if (_.isUndefined(application)) {
      throw new Meteor.Error(404, `${_id} Application isn't found`);
    }
  };
  
  return options;
}

export const startApplication = new ValidatedMethod({
  name: 'application.start',
  mixins: [ hasApplicationMixin ],

  run({ _id }) {
    const application = Applications.findOne(_id);

    // START
    return application.start();
  }
});

export const stopApplication = new ValidatedMethod({
  name: 'application.stop',
  mixins: [ hasApplicationMixin ],

  run({ _id }) {
    const application = Applications.findOne(_id);

    // START
    return application.stop();
  }
});
