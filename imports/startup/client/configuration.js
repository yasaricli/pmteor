import { AccountsTemplates } from 'meteor/useraccounts:core';
import { BodyClass } from 'meteor/lookback:body-class';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Avatar } from 'meteor/utilities:avatar';
import { Router } from 'meteor/iron:router';
import { Modal } from 'meteor/pmteor:modal';

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Avatar.setOptions({
  gravatarDefault: "identicon"
});

// Add Body class default.
BodyClass.add('layout-h');

AccountsTemplates.configure({
  focusFirstInput: true,

  /*
   * Specifies whether to allow to show the form for password change.
   * Note: In case the changePwd route is not configures, this is to be done
   * manually inside some custom template.
   */
  enablePasswordChange: true
});

// Protect all Routes
Router.plugin('ensureSignedIn');

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('changePwd');

// REMOVE PASSWORD AND EMAIL FIELDS
const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');

// AND RESET FIELDS
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);

// HOOK FORMS
AutoForm.addHooks(['InsertApplicationForm', 'UpdateApplicationForm'], {
  onSuccess() {

    // LAST CLOSE MODALS
    Modal.close();
  }
});
