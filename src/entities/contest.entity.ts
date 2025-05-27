import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
    BeforeUpdate,
} from 'sequelize-typescript';

export enum ContestType {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export enum ContestStatus {
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    ACTIVE = 'active',
    CLOSED = 'closed',
}

@Table({
    tableName: 'contests',
    paranoid: false
})
export class Contest extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare title: string;

    @Column({
        type: DataType.ENUM(...Object.values(ContestType)),
        allowNull: true,
    })
    declare type: ContestType;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare startTime: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare endTime: Date;

    @Column({
        type: DataType.ENUM(...Object.values(ContestStatus)),
        allowNull: false,
        defaultValue: ContestStatus.DRAFT,
    })
    declare status: ContestStatus;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    declare slots: string[][];

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: {
            excellent: 30,
            good: 20,
            poor: 5,
            underdog: 15,
        },
    })
    declare xpRules: {
        excellent: number;
        good: number;
        poor: number;
        underdog: number;
    };

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: {
            excellent: 8,
            good: 5,
        },
    })
    declare matchCriteria: {
        excellent: number;
        good: number;
    };

    // @HasMany(() => Participation)
    // declare participations: Participation[];

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @BeforeCreate
    @BeforeUpdate
    static calculateEndTime(instance: Contest) {
        if (instance.startTime) {
            const startDate = new Date(instance.startTime);
            switch (instance.type) {
                case ContestType.DAILY:
                    // Add 1 day
                    instance.endTime = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                    break;
                case ContestType.WEEKLY:
                    // Add 7 days
                    instance.endTime = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                    break;
                case ContestType.MONTHLY:
                    // Add 30 days
                    instance.endTime = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    break;
            }
        }
    }
} 