import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from './entities/user.entity.js';
import { Song } from './entities/song.entity.js';
import { FriendRequest } from './entities/friend-request.entity.js';
import { PlaylistSong } from './entities/playlist-song.entity.js';
import { Watchlist } from './entities/watchlist.entity.js';
import { Otp } from './entities/otp.entity.js';
import { Admin } from './entities/admin.entity.js';
import { Notification } from './entities/notification.entity.js';
import { Config } from './entities/config.entity.js';
import { Contest } from './entities/contest.entity.js';
import { Participation } from './entities/participation.entity.js';

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'wtr_dev',
  logging: process.env.NODE_ENV !== 'production',
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false, // for self-signed certificates
    } : false,
  },
});

// Register all models
sequelize.addModels([
  User,
  Song,
  FriendRequest,
  PlaylistSong,
  Watchlist,
  Otp,
  Admin,
  Notification,
  Config,
  Contest,
  Participation
]);

// Initialize database tables
const initDatabase = async () => {
  try {
    // Now sync other tables with alter: true, force: false
    // await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

export { sequelize, initDatabase }; 