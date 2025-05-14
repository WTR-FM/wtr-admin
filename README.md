# WTR Admin Panel

Admin panel for the WTR application using AdminJS with Express and Sequelize.

## Features

- Complete CRUD operations for all database entities
- User management (users, OTPs, friend requests)
- Content management (songs, playlists, watchlists)
- Authentication with secure password
- PostgreSQL database integration

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` (already done)
   - Update database credentials in `.env` file

3. Start the application:
   ```
   npm run start
   ```

4. Access the admin panel:
   - Navigate to `http://localhost:3000/admin` in your browser
   - Login with the admin credentials defined in your `.env` file
   
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