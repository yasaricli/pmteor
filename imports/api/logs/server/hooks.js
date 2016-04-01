import { Applications } from '../../applications/applications.js';
import { Logs } from '../logs.js';

Logs.before.insert((userId, doc) => {
  const application = Applications.findOne(doc.applicationId);

  // HAS APPLICATION
  if (application) {

    // SEND EMAILS
    application.sendEmailMembers('log', {
      application
    });
  }
});
