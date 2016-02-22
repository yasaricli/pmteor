Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

// Add Body class default.
BodyClass.add('layout-h')

// Protect all Routes
Router.plugin('ensureSignedIn');

AccountsTemplates.configure({
  /*
   * false	Specifies whether to forbid user registration from the client side.
   * In case it is set to true, neither the link for user registration nor the
   * sign up form will be shown.
   */
  forbidClientAccountCreation: true,

  /*
   * Specifies whether to allow to show the form for password change.
   * Note: In case the changePwd route is not configures, this is to be done
   * manually inside some custom template.
   */
  enablePasswordChange: true
});

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('changePwd');

// HOOK FORMS
AutoForm.addHooks(['InsertApplicationForm', 'UpdateApplicationForm'], {
  onSuccess() {

    // GO TO INDEX PAGE
    Router.go('Index');
  }
});
