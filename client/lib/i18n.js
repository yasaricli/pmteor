Tracker.autorun(() => {
  let language = navigator.language.split('-')[0];

  if (language) {
    TAPi18n.setLanguage(language);
  }
});
