import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Song } from './song.entity.js';
import { Watchlist } from './watchlist.entity.js';

@Table({
  tableName: 'playlist_songs',
  indexes: [
    {
      unique: true,
      fields: ['watchlistId', 'songId'],
      name: 'watchlistId_songId_unique',
    },
  ],
})
export class PlaylistSong extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Watchlist)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  watchlistId: string;

  @ForeignKey(() => Song)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  songId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  position: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  syncedWithSpotify: boolean;

  @BelongsTo(() => Watchlist)
  watchlist: Watchlist;

  @BelongsTo(() => Song)
  song: Song;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
} 