import { _ } from 'meteor/underscore';

import Users from '../../users/users.js';
import { Logs } from '../../logs/logs.js';
import { Applications } from '../applications.js';

import { BUNDLE_DIR } from '../../bundles/utils.js';

// NPM PACKAGES
import pm2 from 'pm2';
import { cd, rm } from 'shelljs';

Applications.before.insert((userId, doc) => {

  // MONGO URL DEFAULT
  doc.env.MONGO_URL = `mongodb://localhost:27017/${doc.bundleId}`;

  // DEFAULT MEMBER ADMIN USER
  doc.memberIds = [userId];
});

// REMOVE APPLICATION AFTER
Applications.after.remove((userId, doc) => {

  // Applications all logs removed.
  Logs.remove({ applicationId: doc._id });

  // CONNECT AND DELETE APPLICATION
  pm2.connect((connect_err) => {
    pm2.delete(doc.bundleId, (delete_err) => {

      // CD BUNDLES DIR
      cd(BUNDLE_DIR);

      // REMOVE APPLICATON DIR AND BUNDLE FILE
      rm('-rf', [

        // DIR
        doc.bundleId,

        // TAR.GZ
        `${doc.bundleId}.tar.gz`
      ]);

      // DISCONNECT
      pm2.disconnect();
    });
  });
});
