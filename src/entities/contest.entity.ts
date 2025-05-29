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
import { Op } from 'sequelize';

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
        unique: true,
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

    // Validation for required fields for SCHEDULED or ACTIVE status
    static validateContestFields(instance: Contest) {
        if (!instance.title) {
            throw new Error('Contest title is required');
        }

        if (!instance.type) {
            throw new Error('Contest type is required');
        }

        if (!instance.slots || !Array.isArray(instance.slots) || instance.slots.length === 0) {
            throw new Error('Contest slots are required');
        }

        // If status is ACTIVE, set startTime to current time if not already set
        if (instance.status === ContestStatus.ACTIVE && !instance.startTime) {
            instance.startTime = new Date();
            Contest.calculateEndTime(instance);
        } else if (instance.status === ContestStatus.SCHEDULED && !instance.startTime) {
            // For SCHEDULED, startTime must be provided by admin
            throw new Error('Start time is required for scheduled contests');
        }
    }

    @BeforeCreate
    static validateNewContest(instance: Contest) {
        if (instance.status === ContestStatus.SCHEDULED || instance.status === ContestStatus.ACTIVE) {
            // Validate required fields
            Contest.validateContestFields(instance);
        }

        // If status is CLOSED, ensure endTime is set
        if (instance.status === ContestStatus.CLOSED) {
            instance.endTime = new Date();
        }
    }

    @BeforeCreate
    @BeforeUpdate
    static async checkActiveContestLimit(instance: Contest) {
        // Only perform this check if the contest is being set to ACTIVE or SCHEDULED
        if (instance.status === ContestStatus.ACTIVE || instance.status === ContestStatus.SCHEDULED) {
            // For updates, check if status is changing to ACTIVE or SCHEDULED
            if (instance.isNewRecord === false) {
                const previousStatus = instance.previous('status');
                // If status hasn't changed and is already ACTIVE/SCHEDULED, no need to check
                if (previousStatus === instance.status) {
                    return;
                }
            }

            // Look for any other active or scheduled contests of the same type
            const existingContest = await Contest.findOne({
                where: {
                    type: instance.type,
                    status: { [Op.or]: [ContestStatus.ACTIVE, ContestStatus.SCHEDULED] },
                    id: { [Op.ne]: instance.id } // Exclude current contest
                }
            });

            if (existingContest) {
                throw new Error(`There is already an active or scheduled ${instance.type} contest. Only one ${instance.type} contest can be active or scheduled at a time.`);
            }
        }
    }

    @BeforeCreate
    @BeforeUpdate
    static async validateStartTimeConflict(instance: Contest) {
        // Only check for SCHEDULED contests with startTime
        if (instance.status === ContestStatus.SCHEDULED && instance.startTime) {
            // For updates, check if startTime or status is changing
            if (instance.isNewRecord === false) {
                const previousStartTime = instance.previous('startTime');
                const previousStatus = instance.previous('status');
                
                // If neither startTime nor status has changed, no need to check
                if (previousStartTime && previousStatus === ContestStatus.SCHEDULED &&
                    new Date(previousStartTime).getTime() === new Date(instance.startTime).getTime()) {
                    return;
                }
            }

            // Check for other scheduled contests of the same type with the same start time
            const conflictingContest = await Contest.findOne({
                where: {
                    status: ContestStatus.SCHEDULED,
                    startTime: instance.startTime,
                    id: { [Op.ne]: instance.id } // Exclude current contest
                }
            });

            if (conflictingContest) {
                throw new Error(`There is already a scheduled ${instance.type} contest with the same start time. Please choose a different start time.`);
            }
        }
    }

    @BeforeUpdate
    static validateAndUpdateStatusChange(instance: Contest) {
        // Get the previous version of the instance to check if status is changing
        const previousStatus = instance.previous('status');
        const currentStatus = instance.status;

        // If status is changing to SCHEDULED or ACTIVE
        if (currentStatus === ContestStatus.SCHEDULED || currentStatus === ContestStatus.ACTIVE) {
            // Validate required fields
            Contest.validateContestFields(instance);
        }

        // If status is changing to CLOSED, set endTime to current time
        if (currentStatus === ContestStatus.CLOSED && previousStatus !== ContestStatus.CLOSED) {
            instance.endTime = new Date();
        }
    }
} 