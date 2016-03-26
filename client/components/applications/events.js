Template.applications.events({
  'click .insert': Modal.open('insertApplication'),
  'click .name': Modal.open('updateApplication'),
  'click .start'() {
    Meteor.call('application', {
      applicationId: this._id,
      helper: 'start'
    });
  },
  'click .stop'() {
    Meteor.call('application', {
      applicationId: this._id,
      helper: 'stop'
    });
  },
  'click .delete'() {
    swal({
      title: TAPi18n.__('are-you-sure-title'),
      text: TAPi18n.__('are-you-sure-text'),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f05050",
      confirmButtonText: TAPi18n.__('delete-confirm'),
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: false
    }, () => {
      Applications.remove(this._id, () => {
        swal({
          title: TAPi18n.__('deleted-application-title'),
          text: TAPi18n.__('deleted-application-text'),
          type: "success",
          confirmButtonColor: "#7266ba"
        });
      });
    });
  },
  'click .absoluteUrl'(event) {
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

Template.updateApplicationModal.inheritsEventsFrom('applications');
