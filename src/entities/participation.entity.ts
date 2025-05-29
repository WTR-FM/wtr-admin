import {
    Column,
    Model,
    Table,
    DataType,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { Contest } from './contest.entity.js';
import { User } from './user.entity.js';

@Table({
    tableName: 'participations',
    indexes: [
        {
            unique: true,
            fields: ['contestId', 'userId'],
            name: 'contest_user_unique',
        },
    ],
})
export class Participation extends Model {
    @ForeignKey(() => Contest)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare contestId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare userId: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
    })
    declare team: string[]; // Array of song IDs

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare teamTitle: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare rank: number | null; // Calculated by the system

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare isLocked: boolean;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
} 