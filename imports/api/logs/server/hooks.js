import { TAPi18n } from 'meteor/tap:i18n';
import { Applications } from '../../applications/applications.js';
import { Logs } from '../logs.js';
import { LOG_TYPE_MAPPER } from '../utils.js';

Logs.before.insert((userId, doc) => {
  const application = Applications.findOne({
    bundleId: doc.process.name
  });

  // HAS APPLICATION
  if (application) {

    // TYPE ERROR THEN SEND NOTIFICATIONS
    if (_.isEqual(doc.type, LOG_TYPE_MAPPER.ERRORED)) {

      application.notification({
        type: 'error',
        message: TAPi18n.__('errored-application', application.name)
      });
    }
  }
});
