import AdminJS from 'adminjs'
import { buildAuthenticatedRouter } from '@adminjs/express'
import express from 'express'
// import Connect from 'connect-pg-simple'
import session from 'express-session'
import * as dotenv from 'dotenv'
import formidable from 'express-formidable'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3000

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const start = async () => {
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
      // Add your resources here
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
      cookiePassword: 'sessionsecret',
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
}

start()