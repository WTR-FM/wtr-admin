# WTR Admin Panel

Admin panel for the WTR application using AdminJS with Express and Sequelize.

## Features

- Complete CRUD operations for all database entities
- User management (users, OTPs, friend requests)
- Content management (songs, playlists, watchlists)
- Authentication with secure password
- PostgreSQL database integration
- Persistent database storage

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Make sure the `.env` file has the correct database credentials
   - Set `FORCE_DB_SYNC=false` to maintain database persistence
   - Use `FORCE_DB_SYNC=true` only when you want to forcefully recreate tables

3. Create admin users:
   ```
   npm run create-admin
   ```
   - Follow the interactive prompts to create admin accounts
   - Admin accounts will persist between server restarts

4. Start the application:
   ```
   npm run start
   ```

5. Access the admin panel:
   - Navigate to `http://localhost:5000/admin` in your browser
   - Login with the admin credentials you created
   
## Development

- Run development server with auto-reload:
  ```
  npm run dev
  ```

- Build for production:
  ```
  npm run build
  ```

## Integration with WTR Backend

This admin panel connects to the same PostgreSQL database used by the WTR backend application. It provides an administrative interface for managing all entities defined in the backend.

## Entity Relationships

- Users - Core user accounts
- Songs - Music tracks available in the system
- Watchlists - User playlists/collections
- PlaylistSongs - Junction table connecting songs to playlists
- Friend Requests - Social connections between users
- OTPs - One-time passwords for user verification

## Troubleshooting

- **Database issues**: If you're having problems with the database, check your `.env` file for correct credentials
- **Admin accounts disappearing**: Ensure `FORCE_DB_SYNC` is set to `false` in your `.env` file
- **Login problems**: Use the `npm run create-admin` script to create new admin accounts

## Troubleshooting AdminJS

If you're encountering issues with AdminJS setup:

1. **ESM Compatibility**: AdminJS v7+ is ESM-only. Make sure:
   - Your package.json has `"type": "module"`
   - Use `.js` extension in imports
   - Use dynamic imports where needed

2. **Adapter Registration**: The adapter must be registered properly:
   ```javascript
   const { default: AdminJS } = await import('adminjs');
   const { Database, Resource } = await import('@adminjs/sequelize');
   AdminJS.registerAdapter({ Database, Resource });
   ```

3. **NestJS Integration**: When using with NestJS, use dynamic imports:
   ```javascript
   import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
     // configuration
   }))
   ```

4. **Static Assets**: If styles aren't loading, check the `assets` configuration.

5. **Database Connection**: Ensure your database is running and connection details are correct. 