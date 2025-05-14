import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';

@Table({
  tableName: 'admins',
  indexes: [
    { unique: true, fields: ['email'] },
    { fields: ['isActive'] },
    { fields: ['role'] },
  ],
})
export class Admin extends Model {
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
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM('admin', 'superadmin'),
    allowNull: false,
    defaultValue: 'admin',
  })
  declare role: 'admin' | 'superadmin';

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare refreshToken: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;

  // This method is called before creating a new instance
  @BeforeCreate
  static async hashPasswordOnCreate(instance: Admin) {
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
  static async hashPasswordOnUpdate(instance: Admin) {
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