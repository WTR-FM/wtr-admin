# WTR Admin

An AdminJS-based admin panel for your application.

## Setup

1. Install dependencies:
```
npm install
```

2. Set up environment variables:
Create a `.env` file based on the provided example.

3. Start PostgreSQL database with Docker:
```
docker-compose up -d
```

4. Run the application in development mode:
```
npm run dev
```

Or run both database and application with a single command:
```
npm run dev-with-db
```

## Access

- Main application: http://localhost:3000
- Admin panel: http://localhost:3000/admin

Default admin credentials:
- Email: admin@example.com
- Password: password

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