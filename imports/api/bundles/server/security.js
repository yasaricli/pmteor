import { Security } from 'meteor/ongoworks:security';
import { Bundles } from '../bundles.js';

Security.permit(['insert', 'update', 'remove']).collections([Bundles]).ifHasRole('admin').allowInClientCode();

Bundles.deny({
  download(userId) {
    return true;
  }
});
