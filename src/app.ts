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
import bcrypt from 'bcrypt'

// Register Sequelize adapter
AdminJS.registerAdapter({ Database, Resource })

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3000

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'password',
  role: 'superadmin',
}

const authenticate = async (email: string, password: string) => {
  try {
    // First try to find the admin in the database
    const admin = await Admin.findOne({ where: { email, isActive: true } })
    
    if (admin) {
      // Use the verifyPassword method
      const passwordMatch = await admin.verifyPassword(password)
      if (passwordMatch) {
        return {
          email: admin.email,
          role: admin.role,
          id: admin.id,
        }
      }
    }
    
    // Fallback to default admin if no matching admin found in DB
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve({
        email: DEFAULT_ADMIN.email,
        role: DEFAULT_ADMIN.role,
      })
    }
    
    return null
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Check if a user is a superadmin
const isSuperAdmin = ({ currentAdmin }) => {
  return currentAdmin && currentAdmin.role === 'superadmin'
}

// Check if a user is any kind of admin (superadmin or regular admin)
const isAdmin = ({ currentAdmin }) => {
  return currentAdmin && ['admin', 'superadmin'].includes(currentAdmin.role)
}

const start = async () => {
  try {
    // Initialize database connection
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
    
    // Sync database tables
    await initDatabase()
    
    // Check if default admin exists, if not create it
    const adminExists = await Admin.findOne({
      where: { email: DEFAULT_ADMIN.email }
    })
    
    if (!adminExists) {
      // Create default admin
      // The password will be hashed by the BeforeCreate hook
      await Admin.create({
        email: DEFAULT_ADMIN.email,
        firstName: 'Super',
        lastName: 'Admin',
        password: DEFAULT_ADMIN.password,
        role: 'superadmin',
        isActive: true,
      })
      console.log('Default superadmin account created')
    }
    
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
            listProperties: ['email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
            showProperties: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'updatedAt'],
            editProperties: ['email', 'firstName', 'lastName', 'password', 'role', 'isActive'],
            filterProperties: ['email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
            properties: {
              password: { 
                type: 'password',
                isVisible: {
                  list: false, 
                  filter: false,
                  show: false,
                  edit: true,
                }
              },
              refreshToken: { isVisible: false },
              permissions: { type: 'mixed' },
              fullName: {
                type: 'string',
                isVisible: {
                  list: true,
                  show: true,
                  filter: false,
                  edit: false,
                },
                position: 2,
                isVirtual: true,
                // Return fullName in list and show views
                getter: (record) => {
                  return `${record.params.firstName || ''} ${record.params.lastName || ''}`.trim();
                },
              },
            },
            actions: {
              new: { 
                isAccessible: isSuperAdmin,
                before: async (request) => {
                  // Validate form data
                  if (!request.payload.email) {
                    throw new Error('Email is required');
                  }
                  if (!request.payload.password || request.payload.password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                  }
                  if (!request.payload.firstName) {
                    throw new Error('First name is required');
                  }
                  return request;
                },
              },
              edit: { 
                isAccessible: isSuperAdmin,
                before: async (request) => {
                  // Validate form data
                  if (!request.payload.email) {
                    throw new Error('Email is required');
                  }
                  if (request.payload.password !== '' && request.payload.password && request.payload.password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                  }
                  if (!request.payload.firstName) {
                    throw new Error('First name is required');
                  }
                  
                  // If password is empty, remove it from the payload
                  if (request.payload.password === '') {
                    delete request.payload.password;
                  }
                  return request;
                },
              },
              delete: { isAccessible: isSuperAdmin },
              list: { isAccessible: isSuperAdmin },
              show: { isAccessible: isSuperAdmin },
            },
            navigation: {
              name: 'System Administration',
              icon: 'Shield',
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