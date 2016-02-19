Router.route('/', {
  name: 'Index'
});

Router.plugin('ensureSignedIn', {
  only: ['Index']
});
