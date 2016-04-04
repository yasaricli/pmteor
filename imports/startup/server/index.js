// APPLICATIONS
import '../../api/applications/server/publications.js';
import '../../api/applications/server/migrations.js';
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

// USERS
import '../../api/users/server/hooks.js';

// PM2 POLLING (BUS AND INTERVAL)
import './polling.js';

// SSR EMAIL TEMPLATES
import './ssr.js';
