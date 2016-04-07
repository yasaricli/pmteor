import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Template.currentUserNav.events({
  'click .logout'(event) {
    event.preventDefault();

    // LOGOUT
    AccountsTemplates.logout();
  }
});
