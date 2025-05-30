import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  tableName: 'otps',
  paranoid: false,
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
  declare userId: string;

  @AllowNull(false)
  @Column
  declare otp: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare verified: boolean;
} 