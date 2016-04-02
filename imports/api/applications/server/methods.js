import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Applications } from '../applications.js';
import { hasApplicationMixin } from '../utils.js';

const startApplication = new ValidatedMethod({
  name: 'application.start',
  mixins: [ hasApplicationMixin ],

  run({ _id }) {
    const application = Applications.findOne(_id);

    // START
    return application.start();
  }
});

const stopApplication = new ValidatedMethod({
  name: 'application.stop',
  mixins: [ hasApplicationMixin ],

  run({ _id }) {
    const application = Applications.findOne(_id);

    // START
    return application.stop();
  }
});

export {
  stopApplication,
  startApplication
}
