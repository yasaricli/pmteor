Tracker.autorun(() => {
  const currentUser = Meteor.user();
  let language = 'en';

  if (currentUser) {
    language = currentUser.profile.language;
  }

  // LANGUAGE
  TAPi18n.setLanguage(language);

  // ACCOUNTS PACKAGE LANGUAGE
  T9n.setLanguage(language);
});
