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

## AWS Scheduler Integration

The application now uses AWS Scheduler instead of EventBridge Rules for scheduling contest notifications. This change provides the following benefits:

1. More precise one-time scheduling with the `at()` expression
2. Simplified management of scheduled events
3. Better monitoring and tracking of scheduled tasks

### Required Environment Variables

Make sure you have the following environment variables set:

```
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
SCHEDULER_GROUP_NAME=default
SCHEDULER_EXECUTION_ROLE_ARN=arn:aws:iam::your-account-id:role/SchedulerExecutionRole
BACKEND_URL=<your-api-endpoint>
```

### IAM Role Requirements

Create an IAM role (`SchedulerExecutionRole` or similar) with the following permissions:

1. `scheduler:CreateSchedule`
2. `scheduler:DeleteSchedule`
3. `scheduler:UpdateSchedule`
4. Permission to invoke the target API endpoint

### Schedule Group

By default, the application uses the "default" schedule group. You can specify a custom schedule group using the `SCHEDULER_GROUP_NAME` environment variable. 