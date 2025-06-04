import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
    BeforeUpdate,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { getSchedulerService } from '../services/scheduler-contest.service.js';

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

    // Non-persisted property to differentiate between admin and cron job updates
    preserveStartTime?: boolean;

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

        // If status is ACTIVE, set startTime to current time unless preserveStartTime is true
        if (instance.status === ContestStatus.ACTIVE) {
            // For admin updates, update startTime to current time
            // For cron job updates (preserveStartTime = true), keep the original startTime
            if (!instance.preserveStartTime) {
                instance.startTime = new Date();
                Contest.calculateEndTime(instance);
            }
        } else if (instance.status === ContestStatus.SCHEDULED && !instance.startTime) {
            // For SCHEDULED, startTime must be provided by admin
            throw new Error('Start time is required for scheduled contests');
        }

        if (instance.startTime && !instance.preserveStartTime) {
            const now = new Date();
            const startTime = new Date(instance.startTime);
            // Start time must not be in the past
            // Add a 2-second tolerance to account for small processing delays
            const twoSecondsMs = 2 * 1000; // 2 seconds in milliseconds
            if (startTime.getTime() + twoSecondsMs < now.getTime()) {
                throw new Error('Start time must not be in the past for scheduled / active contests');
            }
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

    // Uncomment this to prevent active contest more than one
    // This revokes to active / schedule the contest if there is already an active / scheduled contest of the same type
    // TODO: Add a case to allow admin to schedule multiple contests of the same type at different times (e.g. daily - after 1 day, weekly - after 1 week, monthly - after 1 month)
    // @BeforeCreate
    // @BeforeUpdate
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

    // Uncomment this to prevent start time conflicts
    // @BeforeCreate
    // @BeforeUpdate
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

        // If status is CLOSED, prevent any updates
        if (previousStatus === ContestStatus.CLOSED) {
            throw new Error('Closed contests cannot be modified');
        }

        // If previous status was ACTIVE, only allow changing status to CLOSED
        if (previousStatus === ContestStatus.ACTIVE) {
            // Get all changed fields
            const changedFields = instance.changed() || [];

            console.log("Changed Fields: ", changedFields);

            // When changing from ACTIVE to CLOSED, we'll only care about the status change
            // and ignore other potential Sequelize-detected changes in JSONB fields
            if (changedFields.includes('status')) {
                // Only allow changing to CLOSED status
                if (currentStatus !== ContestStatus.CLOSED) {
                    throw new Error('Active contests can only be updated to change status to CLOSED');
                }
                // If changing to CLOSED, allow any other detected changes (often false positives with JSON)
            } else {
                // If not changing status, don't allow any other changes
                throw new Error('Active contests can only be updated to change status to CLOSED');
            }
        }

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

    @AfterCreate
    static async logCreation(instance: Contest) {
        try {
            // Get ContestChangeLog model dynamically to avoid circular dependency
            const contestChangeLogModule = await import('./contest-change-log.entity.js');
            const ContestChangeLog = contestChangeLogModule.ContestChangeLog;

            // Log the admin ID that will be used
            console.log('Creating contest log with Admin ID:', (global as any).currentAdminId || null);

            // Create a log entry for the new contest
            await ContestChangeLog.create({
                contestId: instance.id,
                adminId: (global as any).currentAdminId || null, // Use currentAdminId instead of currentUserId
                changes: Object.keys(instance.dataValues)
                    .filter(key => !['id', 'createdAt', 'updatedAt'].includes(key) && instance.dataValues[key] !== null)
                    .map(key => ({
                        key,
                        prevValue: null,
                        newValue: instance.dataValues[key],
                    })),
                description: 'Contest created',
            });
        } catch (error) {
            console.error('Error logging contest creation:', error);
        }
    }

    @AfterUpdate
    static async logChanges(instance: Contest) {
        try {
            // Get changed fields
            const changedFields = instance.changed() as string[];
            if (!changedFields || changedFields.length === 0) {
                return; // No changes to log
            }

            // Get ContestChangeLog model dynamically to avoid circular dependency
            const contestChangeLogModule = await import('./contest-change-log.entity.js');
            const ContestChangeLog = contestChangeLogModule.ContestChangeLog;

            // Build the changes array
            const changes = changedFields.map(field => ({
                key: field,
                prevValue: instance.previous(field),
                newValue: instance.get(field),
            }));

            // Log the admin ID that will be used
            console.log('Updating contest log with Admin ID:', (global as any).currentAdminId || null);

            // Create log entry
            await ContestChangeLog.upsert({
                contestId: instance.id,
                adminId: (global as any).currentAdminId || null, // Use currentAdminId instead of currentUserId
                changes,
                description: `Contest updated: ${changedFields.join(', ')}`,
            });
        } catch (error) {
            console.error('Error logging contest changes:', error);
        }
    }

    /**
     * Handle notification scheduling after contest creation
     */
    @AfterCreate
    static async scheduleNotifications(instance: Contest) {
        try {
            // Only schedule notifications for SCHEDULED contests with startTime
            if (instance.status === ContestStatus.SCHEDULED && instance.startTime) {
                const schedulerService = getSchedulerService();
                await schedulerService.scheduleContestNotifications(instance.id, instance.startTime);
                console.log(`Scheduled notifications for contest ${instance.id} at ${instance.startTime}`);
            }
        } catch (error) {
            console.error(`Error scheduling notifications for contest ${instance.id}:`, error);
            // Don't throw error as it shouldn't prevent contest creation
        }
    }

    /**
     * Handle notification updates after contest update
     */
    @AfterUpdate
    static async updateNotifications(instance: Contest) {
        try {
            const changedFields = instance.changed() as string[];
            const previousStartTime = instance.previous('startTime');
            const previousStatus = instance.previous('status');
            const currentStatus = instance.status;
            const currentStartTime = instance.startTime;

            // Check if we need to update notifications
            const startTimeChanged = changedFields.includes('startTime');
            const statusChanged = changedFields.includes('status');
            
            // Scenarios where we need to handle notifications:
            // 1. startTime changed for SCHEDULED contest
            // 2. Status changed from SCHEDULED to something else (remove notifications)
            // 3. Status changed to SCHEDULED (add notifications)
            // 4. Status changed to CLOSED (remove notifications)

            if (startTimeChanged && currentStatus === ContestStatus.SCHEDULED && currentStartTime) {
                // Update notifications with new start time
                const schedulerService = getSchedulerService();
                await schedulerService.updateContestNotifications(instance.id, currentStartTime);
                console.log(`Updated notifications for contest ${instance.id} with new start time ${currentStartTime}`);
            } else if (statusChanged) {
                const schedulerService = getSchedulerService();
                
                if (currentStatus === ContestStatus.SCHEDULED && currentStartTime) {
                    // Status changed to SCHEDULED - add notifications
                    await schedulerService.scheduleContestNotifications(instance.id, currentStartTime);
                    console.log(`Scheduled notifications for contest ${instance.id} (status changed to SCHEDULED)`);
                } else if (previousStatus === ContestStatus.SCHEDULED) {
                    // Status changed from SCHEDULED to something else - remove notifications
                    await schedulerService.removeContestNotifications(instance.id);
                    console.log(`Removed notifications for contest ${instance.id} (status changed from SCHEDULED to ${currentStatus})`);
                }
            }
        } catch (error) {
            console.error(`Error updating notifications for contest ${instance.id}:`, error);
            // Don't throw error as it shouldn't prevent contest update
        }
    }

    /**
     * Handle cleanup after contest deletion
     */
    @AfterDestroy
    static async handleContestDeletion(instance: Contest) {
        try {
            // Remove any scheduled notifications
            if (instance.status === ContestStatus.SCHEDULED) {
                const schedulerService = getSchedulerService();
                await schedulerService.removeContestNotifications(instance.id);
                console.log(`Removed notifications for deleted contest ${instance.id}`);
            }
        } catch (error) {
            console.error(`Error handling deletion for contest ${instance.id}:`, error);
            // Don't throw error as it shouldn't prevent contest deletion
        }
    }
}