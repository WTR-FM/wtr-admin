import AdminJS from 'adminjs'
import * as dotenv from 'dotenv'
import { Database, Resource } from '@adminjs/sequelize'
import { sequelize, initDatabase } from './db.js'
import { getResourceConfigurations } from './utils/resource-config.js'
import { configureAdminJS, setupExpressServer } from './utils/server.js'

// Register Sequelize adapter
AdminJS.registerAdapter({ Database, Resource })

// Load environment variables
dotenv.config()

// Set default timezone to UTC
process.env.TZ = 'UTC'

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    // Initialize database connection
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
    
    // Sync database tables
    await initDatabase()
    
    // Get resource configurations
    const resources = getResourceConfigurations()
    
    // Configure AdminJS
    const admin = configureAdminJS(resources)
    
    // Setup Express server
    const app = setupExpressServer(admin)

    // Start server
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
      console.log(`Server running with timezone set to: ${process.env.TZ}`)
    })
  } catch (error) {
    console.error('Error starting the application:', error)
  }
}

start()