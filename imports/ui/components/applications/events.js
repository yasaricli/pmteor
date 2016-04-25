import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Modal } from 'meteor/pmteor:modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { Applications } from '../../../api/applications/applications.js';

Template.applications.events({
  'click .insert': Modal.open('insertApplication'),
  'click .name': Modal.open('updateApplication'),

  'click .start'(event, instance) {
    const { _id } = this;
    Meteor.call('application.start', { _id });
  },

  'click .stop'(event, instance) {
    const { _id } = this;
    Meteor.call('application.stop', { _id });
  },

  'click .build'(event, instance) {
    const { _id } = this;
    Meteor.call('application.build', { _id });
  },

  'click .delete': Modal.confirm('removeApplication', (instance, data) => {
    Applications.remove(data._id, (err) => {

      // Close all modals
      Modal.close();
    });
  }),

  'click .absoluteUrl'(event, instance) {
    event.preventDefault();

    // in container then  go to click stop.
    window.open(this.absoluteUrl());
  }
});

Template.application.events({
  'click .members': Modal.open('members')
});

Template.membersModal.events({
  'click .add-collaborator': Modal.open('addCollaborator'),
  'click .delete'(event, instance) {

    // PULL MEMBER
    Applications.update(instance.data._id, {
      $pull: {
        memberIds: this._id
      }
    });
  }
});

Template.addCollaboratorModal.events({
  'click .add'(event, instance) {

    // PUSH NEW MEMBER
    Applications.update(instance.data._id, {
      $push: {
        memberIds: this._id
      }
    }, () => {

      // Close and back.
      Modal.close();
    });
  }
});

Template.logs.events({
  'click .filter .btn'(event, instance) {
    const $this = $(event.currentTarget);

    // SET FILTER
    Session.set('logs-filter', $this.attr('type') || null);
  }
});

Template.updateApplicationModal.inheritsEventsFrom('applications');
