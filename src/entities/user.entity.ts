import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';

@Table({
  tableName: 'users',
  paranoid: false,
  indexes: [
    { unique: true, fields: ['email'] },
    { fields: ['isSuspended'] },
    { fields: ['isVerified'] },
    { fields: ['role'] },
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
    type: DataType.ENUM('superadmin', 'admin', 'viewer', 'user'),
    allowNull: false,
    defaultValue: 'user',
  })
  declare role: 'superadmin' | 'admin' | 'viewer' | 'user';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare profileImageUrl: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // This method is called before creating a new instance
  @BeforeCreate
  static async hashPasswordOnCreate(instance: User) {
    console.log('BeforeCreate hook called, hashing password');
    if (instance.password) {
      try {
        console.log('Hashing password for new user:', instance.email);
        instance.password = await hash(instance.password, 10);
        console.log('Password hashed successfully');
      } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
      }
    }
  }

  // This method is called before updating an instance
  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User) {
    console.log('BeforeUpdate hook called for user:', instance.email);
    // Hash the password only if it was changed
    if (instance.changed('password') && instance.password) {
      try {
        console.log('Password changed, hashing new password');
        instance.password = await hash(instance.password, 10);
        console.log('Password hashed successfully');
      } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
      }
    }
  }
}

export type UserAttributes = Omit<User, 'id' | 'isSuspended' | 'isVerified'>;
