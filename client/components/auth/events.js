Template.currentUserNav.events({
  'click .logout'(event) {
    event.preventDefault();

    // LOGOUT
    AccountsTemplates.logout();
  }
});
