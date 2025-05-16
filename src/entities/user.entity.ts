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
  tableName: 'users',
  paranoid: false,
  indexes: [
    { unique: true, fields: ['email'] },
    { fields: ['isSuspended'] },
    { fields: ['isVerified'] },
  ],
  scopes: {
    verified: { where: { isVerified: true } },
    suspended: { where: { isSuspended: false } },
    withoutPassword: { attributes: { exclude: ['password'] } },
  },
})
export class User extends Model {
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
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare lastName: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare isSuspended: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isVerified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare refreshToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare coinbaseWalletAddress: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  declare spotifyTokens: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare country: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare pincode: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare about: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;
}

export type UserAttributes = Omit<User, 'id' | 'isSuspended' | 'isVerified'>;
