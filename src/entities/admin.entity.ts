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
import bcrypt from 'bcrypt';

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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

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
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare refreshToken: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  declare permissions: any;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;

  // Virtual field for full name
  get fullName(): string {
    return this.lastName 
      ? `${this.firstName} ${this.lastName}` 
      : this.firstName;
  }

  @BeforeCreate
  static async hashPasswordBeforeCreate(instance: Admin) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(instance: Admin) {
    if (instance.changed('password') && instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  // Method to verify password
  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 