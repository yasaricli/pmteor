Tracker.autorun(() => {
  let language = 'en';
  const currentUser = Meteor.user();

  if (currentUser) {
    language = currentUser.profile.language;
  }

  // LANGUAGE
  TAPi18n.setLanguage(language);

  // ACCOUNTS PACKAGE LANGUAGE
  T9n.setLanguage(language);
});
