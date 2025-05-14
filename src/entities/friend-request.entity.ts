import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { User } from './user.entity.js';

@Table({ 
  tableName: 'friend_requests',
  paranoid: false 
})
export class FriendRequest extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare requesterId: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare receiverId: string;

  @Column({
    type: DataType.ENUM('pending', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'accepted' | 'rejected';

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
} 