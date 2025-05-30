import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'songs',
  paranoid: false,
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
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare artist: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare album: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare sourceId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'spotify'
  })
  declare source: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare albumCover: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare durationMs: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare previewUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare lyrics: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare metadata: any;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
