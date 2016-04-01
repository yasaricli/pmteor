import { Migrations } from 'meteor/idmontie:migrations';
import { Applications } from '../applications.js';

Migrations.add('memberIds', () => {
  Applications.find({ }).forEach((doc) => {
    const { _id, createdBy } = doc;

    Applications.update(_id, {
      $set: {
        memberIds: [createdBy]
      }
    });
  });
});
