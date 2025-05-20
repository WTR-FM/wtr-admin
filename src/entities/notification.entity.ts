import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'notifications',
  paranoid: false,
  indexes: [
    { fields: ['triggerName'] },
  ],
})
export class Notification extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'JSON template containing email and push notification content',
  })
  declare template: {
    email: {
      subject: string;
      body: string;
    };
    push: {
      subject: string;
      body: string;
    };
  };

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for the notification trigger',
  })
  declare triggerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Optional description of the notification purpose',
  })
  declare description: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
} 