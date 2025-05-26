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

export enum WatchlistType {
  ROSTER = 'roster',
  WATCHLIST = 'watchlist',
  TEAM = 'team',
}

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
  declare userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare imageUrl: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: [],
  })
  declare tags: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isPublic: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isCollaborative: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isDraft: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(WatchlistType)),
    allowNull: false,
    defaultValue: WatchlistType.WATCHLIST,
  })
  declare type: WatchlistType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare spotifyPlaylistId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare metadata: any;

  @HasMany(() => PlaylistSong)
  declare playlistSongs: PlaylistSong[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
