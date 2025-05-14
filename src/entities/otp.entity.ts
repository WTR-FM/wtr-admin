import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  tableName: 'otps',
  indexes: [
    { fields: ['userId'] },
    { fields: ['otp'] },
  ],
})
export class Otp extends Model {
  @Column({
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
    primaryKey: true,
  })
  declare id: string;

  @AllowNull(false)
  @Column
  userId: string;

  @AllowNull(false)
  @Column
  otp: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  expiresAt: Date;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  verified: boolean;
} 