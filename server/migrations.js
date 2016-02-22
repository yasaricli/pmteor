/*
 * Export env variable
 *
 *   Example:
 *   export ADMIN="user:password@domain.com"
 */
hasEnv('ADMIN', (ADMIN) => {
  Migrations.add('users', () => {
    const [user, domain] = ADMIN.split('@');
    const [username, password] = user.split(':');

    const _id = Accounts.createUser({

      // Username and Password
      username, password,

      // Email
      email: `${username}@${domain}`,

      // Profile
      profile: {
        first_name: username
      }
    });

    // ADD ROLE
    Roles.addUsersToRoles(_id, 'admin');
  });
});
