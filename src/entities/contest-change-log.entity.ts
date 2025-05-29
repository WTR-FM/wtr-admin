import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Contest } from './contest.entity.js';
import { User } from './user.entity.js';

/**
 * Change log entry for contest changes
 * Records all changes made to contests
 */
@Table({
    tableName: 'contest_change_logs',
    paranoid: false
})
export class ContestChangeLog extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => Contest)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        references: {
            model: 'contests',
            key: 'id'
        },
        onDelete: 'CASCADE',
    })
    declare contestId: string;

    @BelongsTo(() => Contest)
    declare contest: Contest;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'NO ACTION',
    })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;
    
    @Column({
        type: DataType.JSONB,
        allowNull: false,
        comment: 'Array of changes, each containing key, prevValue, newValue',
    })
    declare changes: Array<{
        key: string;
        prevValue: any;
        newValue: any;
    }>;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        comment: 'Optional description of the changes',
    })
    declare description: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
} 