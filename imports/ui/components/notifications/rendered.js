import { Template } from 'meteor/templating';
import { Notifications } from '../../../api/notifications/notifications.js';

Template.notifications.onRendered(() => {
  Notifications.find({ }).observe({
    added(doc) {
      sAlert[doc.type](doc.message);
    }
  });
});
