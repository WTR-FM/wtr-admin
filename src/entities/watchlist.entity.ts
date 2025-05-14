import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { PlaylistSong } from './playlist-song.entity.js';

@Table({
  tableName: 'watchlists',
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'name'],
      name: 'userId_watchlistName_unique',
    },
  ],
})
export class Watchlist extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPublic: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCollaborative: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true
  })
  spotifyPlaylistId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: any;

  @HasMany(() => PlaylistSong)
  playlistSongs: PlaylistSong[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
} 