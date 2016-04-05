import { _ } from 'meteor/underscore';
import { Applications } from './applications';

// NODE ENV
const NODE_ENV_ALLOWED_VALUES = ['PMTEOR'];

// DEFAULT ENV LIST EQ 0
const [ DEFAULT_NODE_ENV ] = NODE_ENV_ALLOWED_VALUES;

// ALLOW STATUS LIST
const STATUS_ALLOWED_VALUES = ['STOP', 'EXIT', 'ONLINE', 'READY', 'ERRORED', 'RESTART', 'RESTART OVERLIMIT'];

// MAPPER STATUS LIST
const STATUS_MAPPER = {
  STOP: STATUS_ALLOWED_VALUES[0],
  EXIT: STATUS_ALLOWED_VALUES[1],
  ONLINE: STATUS_ALLOWED_VALUES[2],
  READY: STATUS_ALLOWED_VALUES[3],
  ERRORED: STATUS_ALLOWED_VALUES[4],
  RESTART: STATUS_ALLOWED_VALUES[2]
}

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

export {
  NODE_ENV_ALLOWED_VALUES,
  DEFAULT_NODE_ENV,
  STATUS_ALLOWED_VALUES,
  STATUS_MAPPER,

  // VALIDATE METHODS MIXINS
  hasApplicationMixin
}
