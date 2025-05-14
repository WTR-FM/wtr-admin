import AdminJS from 'adminjs'
import { buildAuthenticatedRouter } from '@adminjs/express'
import express from 'express'
// import Connect from 'connect-pg-simple'
import session from 'express-session'
import * as dotenv from 'dotenv'
import formidable from 'express-formidable'
import { Database, Resource } from '@adminjs/sequelize'
import { sequelize, initDatabase } from './db.js'
import { User } from './entities/user.entity.js'
import { Song } from './entities/song.entity.js'
import { FriendRequest } from './entities/friend-request.entity.js'
import { PlaylistSong } from './entities/playlist-song.entity.js'
import { Watchlist } from './entities/watchlist.entity.js'
import { Otp } from './entities/otp.entity.js'
import { Admin } from './entities/admin.entity.js'
import { AdminAuthService } from './services/admin-auth.service.js'

// Register Sequelize adapter
AdminJS.registerAdapter({ Database, Resource })

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 5000

// Authentication handler using our AdminAuthService
const authenticate = async (email: string, password: string) => {
  console.log(`Authentication attempt with email: ${email}`);
  // Try admin database authentication
  console.log('Attempting database authentication...');
  const admin = await AdminAuthService.authenticate(email, password);
  
  if (admin) {
    console.log('Database authentication successful for:', admin.email);
    console.log('User role:', admin.role);
  } else {
    console.log('Database authentication failed');
  }
  
  return admin;
}

const start = async () => {
  try {
    // Initialize database connection
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
    // Sync database tables
    await initDatabase()
    const app = express()
    
    // For parsing form data
    app.use(formidable())

    const admin = new AdminJS({
      rootPath: '/admin',
      branding: {
        companyName: 'WTR Admin Panel',
        logo: false,
        favicon: '/favicon.ico',
      },
      resources: [
        {
          resource: Admin,
          options: {
            listProperties: ['name', 'email', 'role', 'isActive', 'createdAt'],
            showProperties: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
            editProperties: ['name', 'email', 'role', 'isActive'],
            filterProperties: ['name', 'email', 'role', 'isActive', 'createdAt'],
            properties: {
              password: { 
                type: 'password',
                isVisible: {
                  list: false,
                  filter: false,
                  show: false,
                  edit: false,
                }
              },
              refreshToken: { isVisible: false },
            },
            navigation: {
              name: null,
              icon: 'Admin',
            },
            actions: {
              // Only superadmin can see this resource
              list: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              show: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              edit: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              new: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              setPassword: {
                actionType: 'record',
                icon: 'Password',
                isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin),
                handler: async (request, response, context) => {
                  const { record, currentAdmin } = context;
                  
                  if (!request.method || request.method === 'GET') {
                    return {
                      record: record.toJSON(),
                    };
                  }
                  
                  // Handle POST - password update
                  const { password, passwordConfirmation } = request.payload || {};
                  
                  if (!password || !passwordConfirmation) {
                    throw new Error('Both password and confirmation are required');
                  }
                  
                  if (password !== passwordConfirmation) {
                    throw new Error('Passwords do not match');
                  }
                  
                  if (password.length < 8) {
                    throw new Error('Password must be at least 8 characters long');
                  }
                  
                  // Update the password
                  await Admin.update(
                    { password },
                    { where: { id: record.param('id') }, individualHooks: true }
                  );
                  
                  return {
                    record: record.toJSON(),
                    notice: {
                      message: 'Password has been updated successfully',
                      type: 'success',
                    },
                    redirectUrl: `/admin/resources/Admin/records/${record.param('id')}/show`,
                  };
                },
              },
            },
          },
        },
        {
          resource: User,
          options: {
            listProperties: ['firstName', 'lastName', 'email', 'isActive', 'isVerified', 'createdAt'],
            showProperties: ['id', 'firstName', 'lastName', 'email', 'isActive', 'isVerified', 'createdAt', 'updatedAt', 'coinbaseWalletAddress'],
            editProperties: ['firstName', 'lastName', 'email', 'isActive', 'isVerified', 'coinbaseWalletAddress'],
            filterProperties: ['firstName', 'lastName', 'email', 'isActive', 'isVerified', 'createdAt'],
            properties: {
              password: { isVisible: false },
              refreshToken: { isVisible: false },
              spotifyTokens: { type: 'mixed' },
            },
            navigation: {
              name: 'User Management',
              icon: 'User',
            },
          },
        },
        {
          resource: Song,
          options: {
            listProperties: ['title', 'artist', 'album', 'source', 'createdAt'],
            showProperties: ['id', 'title', 'artist', 'album', 'source', 'sourceId', 'albumCover', 'durationMs', 'previewUrl', 'createdAt'],
            editProperties: ['title', 'artist', 'album', 'sourceId', 'source', 'albumCover', 'durationMs', 'previewUrl', 'lyrics'],
            filterProperties: ['title', 'artist', 'album', 'source', 'createdAt'],
            properties: {
              metadata: { type: 'mixed' },
              lyrics: { type: 'textarea' },
            },
            navigation: {
              name: 'Content Management',
              icon: 'MusicNote',
            },
          },
        },
        {
          resource: Watchlist,
          options: {
            listProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
            showProperties: ['id', 'name', 'description', 'userId', 'isPublic', 'isCollaborative', 'imageUrl', 'spotifyPlaylistId', 'createdAt'],
            editProperties: ['name', 'description', 'userId', 'isPublic', 'isCollaborative', 'imageUrl', 'spotifyPlaylistId'],
            filterProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
            properties: {
              metadata: { type: 'mixed' },
              description: { type: 'textarea' },
            },
            navigation: {
              name: 'Content Management',
              icon: 'List',
            },
          },
        },
        {
          resource: PlaylistSong,
          options: {
            listProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify', 'createdAt'],
            navigation: {
              name: 'Content Management',
            },
          },
        },
        {
          resource: FriendRequest,
          options: {
            listProperties: ['requesterId', 'receiverId', 'status', 'createdAt'],
            navigation: {
              name: 'User Management',
            },
          },
        },
        {
          resource: Otp,
          options: {
            listProperties: ['email', 'code', 'expiresAt', 'verified', 'createdAt'],
            navigation: {
              name: 'User Management',
            },
          },
        },
      ],
    })

//   const ConnectSession = Connect(session)
//   const sessionStore = new ConnectSession({
//     conObject: {
//       connectionString: 'postgres://adminjs:@localhost:5432/adminjs',
//       ssl: process.env.NODE_ENV === 'production',
//     },
//     tableName: 'session',
//     createTableIfMissing: true,
//   })

    const adminRouter = buildAuthenticatedRouter(
      admin, 
      {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_SECRET || 'sessionsecret',
      },
      null,
      {
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || 'sessionsecret',
        cookie: {
          httpOnly: process.env.NODE_ENV === 'production',
          secure: process.env.NODE_ENV === 'production',
        },
        name: 'adminjs',
      }
    )
    
    app.use(admin.options.rootPath, adminRouter)

    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
  } catch (error) {
    console.error('Error starting the application:', error)
  }
}

start()