import './templates.html';

import { Template } from 'meteor/templating';
import { Applications } from '../../../api/applications/applications.js';

Template.applications.helpers({
  apps() {
    return Applications.find({}, {
      sort: {
        createdAt: -1
      }
    });
  }
});

Template.application.helpers({
  tabs() {
    return [
      {
        name: 'Monitoring',
        slug: 'monitoring',

        /*
         * On render Monitoring then chart cpu and memory reload.
         * if not then resize errors.
         */
        onRender(slug, instance) {
          const monitoring = _.find(Template._renderedInstances, (doc) => {
            return _.isEqual(doc.view.name, 'Template.monitoring');
          });

          if (_.has(monitoring, 'charts')) {
            monitoring.charts.reload();
          }
        }
      },
      { name: 'Logs', slug: 'logs' }
    ];
  }
});

Template.updateApplicationModal.helpers({
  application() {
    return Applications.findOne(this._id);
  }
});

Template.insertApplicationModal.helpers({
  collection() {
    return Applications;
  }
});

Template.updateApplicationModal.inheritsHelpersFrom('insertApplicationModal');
Template.membersModal.inheritsHelpersFrom('updateApplicationModal');
