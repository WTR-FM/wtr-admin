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
  console.log("Looking for Email: ", email, "Password: ", password);
  const admin = await AdminAuthService.authenticate(email, password);
  console.log("Admin: ", admin);
  
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
            showProperties: ['id', 'firstName', 'lastName', 'email', 'password', 'role', 'isActive', 'refreshToken', 'createdAt', 'updatedAt'],
            editProperties: ['firstName', 'lastName', 'email', 'password', 'role', 'isActive'],
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
              icon: 'Users',
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
                icon: 'Key',
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
            showProperties: ['id', 'firstName', 'lastName', 'email', 'password', 'isActive', 'isVerified', 'coinbaseWalletAddress', 'refreshToken', 'spotifyTokens', 'createdAt', 'updatedAt'],
            editProperties: ['isActive', 'isVerified'],
            filterProperties: ['firstName', 'lastName', 'email', 'isActive', 'isVerified', 'createdAt'],
            properties: {
              password: { isVisible: false },
              refreshToken: { isVisible: false },
              spotifyTokens: { type: 'mixed' },
            },
            actions: {
              delete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
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
            showProperties: ['id', 'title', 'artist', 'album', 'source', 'sourceId', 'albumCover', 'durationMs', 'previewUrl', 'lyrics', 'metadata', 'createdAt', 'updatedAt'],
            editProperties: ['title', 'artist', 'album', 'sourceId', 'source', 'albumCover', 'durationMs', 'previewUrl', 'lyrics', 'metadata'],
            filterProperties: ['title', 'artist', 'album', 'source', 'createdAt'],
            properties: {
              metadata: { type: 'mixed' },
              lyrics: { type: 'textarea' },
            },
            actions: {
              delete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            },
            navigation: {
              name: 'Content Management',
              icon: 'Music',
            },
          },
        },
        {
          resource: Watchlist,
          options: {
            listProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
            showProperties: ['id', 'userId', 'name', 'description', 'imageUrl', 'isPublic', 'isCollaborative', 'spotifyPlaylistId', 'metadata', 'playlistSongs', 'createdAt', 'updatedAt'],
            editProperties: ['name', 'description', 'userId', 'isPublic', 'isCollaborative', 'imageUrl', 'spotifyPlaylistId', 'metadata'],
            filterProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
            properties: {
              metadata: { type: 'mixed' },
              description: { type: 'textarea' },
            },
            actions: {
              delete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            },
            navigation: {
              name: 'Content Management',
              icon: 'Eye',
            },
          },
        },
        {
          resource: PlaylistSong,
          options: {
            listProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify', 'createdAt'],
            showProperties: ['id', 'watchlistId', 'songId', 'position', 'syncedWithSpotify', 'watchlist', 'song', 'createdAt', 'updatedAt'],
            editProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify'],
            actions: {
              delete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            },
            navigation: {
              name: 'Content Management',
              icon: 'Playlist',
            },
          },
        },
        {
          resource: FriendRequest,
          options: {
            listProperties: ['requesterId', 'receiverId', 'status', 'createdAt'],
            showProperties: ['id', 'requesterId', 'receiverId', 'status', 'createdAt', 'updatedAt'],
            editProperties: ['requesterId', 'receiverId', 'status'],
            actions: {
              delete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            },
            navigation: {
              name: 'User Management',
              icon: 'Users',
            },
          },
        },
        {
          resource: Otp,
          options: {
            listProperties: ['userId', 'otp', 'expiresAt', 'verified', 'createdAt'],
            showProperties: ['id', 'userId', 'otp', 'expiresAt', 'verified', 'createdAt', 'updatedAt'],
            editProperties: ['expiresAt', 'verified'],
            actions: {
              delete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
              bulkDelete: {  isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            },
            navigation: {
              name: 'User Management',
              icon: 'Lock',
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