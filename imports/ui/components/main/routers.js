import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

Router.route('/', {
  name: 'Index',
  waitOn() {
    return Meteor.subscribe('applications');
  }
});
