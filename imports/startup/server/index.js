// MAIN SERVER FILES.
import './polling.js';
import './permit.js';
import './ssr.js';

// APPLICATIONS
import '../../api/applications/server/publications.js';
import '../../api/applications/server/security.js';
import '../../api/applications/server/methods.js';
import '../../api/applications/server/helpers.js';
import '../../api/applications/server/hooks.js';

// BUNDLES
import '../../api/bundles/server/security.js';
import '../../api/bundles/server/hooks.js';

// LOGS
import '../../api/logs/server/security.js';
import '../../api/logs/server/helpers.js';
import '../../api/logs/server/hooks.js';

// NOTIFICATIONS
import '../../api/notifications/server/security.js';

// USERS
import '../../api/users/server/hooks.js';
