import { Security } from 'meteor/ongoworks:security';
import { Bundles } from '../bundles.js';

Security.permit(['insert', 'remove', 'update']).collections([Bundles]).ifHasRole('admin').allowInClientCode();
Security.permit(['download']).collections([Bundles]).never().allowInClientCode();
