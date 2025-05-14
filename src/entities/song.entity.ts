import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'songs',
  indexes: [
    {
      unique: true,
      fields: ['source', 'sourceId'],
      name: 'source_sourceId_unique',
    },
  ],
})
export class Song extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  artist: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  album: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  sourceId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'spotify'
  })
  source: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  albumCover: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  durationMs: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  previewUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  lyrics: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: any;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;
}
