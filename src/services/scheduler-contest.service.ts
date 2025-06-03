import {
    SchedulerClient,
    CreateScheduleCommand,
    DeleteScheduleCommand,
    UpdateScheduleCommand,
    ScheduleState,
    Target,
    ListSchedulesCommand,
    FlexibleTimeWindowMode,
    ActionAfterCompletion
} from '@aws-sdk/client-scheduler';

export interface ContestNotificationEvent {
    contestId: string;
    triggerName: 'wtr_wednesday_reminder' | 'team_not_submitted_final_hours';
    startTime: Date;
}

export class SchedulerContestService {
    private schedulerClient: SchedulerClient;
    private notificationEndpointARN: string;
    private scheduleGroup?: string;

    constructor(
        region: string = 'eu-north-1',
        notificationEndpointARN: string,
        scheduleGroup: string = 'default'
    ) {
        const credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };
        this.schedulerClient = new SchedulerClient({ region, credentials });
        this.notificationEndpointARN = notificationEndpointARN;
        this.scheduleGroup = scheduleGroup;

        console.log("Notification Endpoint ARN: ", notificationEndpointARN);
        console.log("AWS Region: ", region);
        console.log("Schedule Group: ", scheduleGroup);
        console.log("Using credentials with Access Key ID: ", credentials.accessKeyId ? credentials.accessKeyId.substring(0, 5) + '...' : 'undefined');
    }

    /**
     * Schedule notification events for a contest
     */
    async scheduleContestNotifications(contestId: string, startTime: Date): Promise<void> {
        const now = new Date();
        const startTimeMs = startTime.getTime();
        const nowMs = now.getTime();

        // Calculate trigger times
        const sevenHoursBefore = new Date(startTimeMs - (7 * 60 * 60 * 1000));
        const twoHoursBefore = new Date(startTimeMs - (2 * 60 * 60 * 1000));

        const promises: Promise<void>[] = [];

        // Schedule 7-hour notification if it's at least 7 hours in the future
        if (sevenHoursBefore.getTime() > nowMs) {
            promises.push(
                this.createScheduledEvent(contestId, 'wtr_wednesday_reminder', sevenHoursBefore)
            );
            console.log("Scheduled 7 hours notification with AWS Scheduler");
        }

        // Schedule 2-hour notification if it's at least 2 hours in the future
        if (twoHoursBefore.getTime() > nowMs) {
            promises.push(
                this.createScheduledEvent(contestId, 'team_not_submitted_final_hours', twoHoursBefore)
            );
            console.log("Scheduled 2 hours notification with AWS Scheduler");
        }

        await Promise.all(promises);
    }

    /**
     * Remove existing notification events for a contest
     */
    async removeContestNotifications(contestId: string): Promise<void> {
        const scheduleNames = [
            this.getScheduleName(contestId, 'wtr_wednesday_reminder'),
            this.getScheduleName(contestId, 'team_not_submitted_final_hours')
        ];

        const promises = scheduleNames.map(scheduleName => this.deleteScheduledEvent(scheduleName));
        await Promise.allSettled(promises); // Use allSettled to continue even if some deletions fail
    }

    /**
     * Update contest notifications - removes old ones and creates new ones
     */
    async updateContestNotifications(contestId: string, newStartTime: Date): Promise<void> {
        // Remove existing notifications
        await this.removeContestNotifications(contestId);

        // Schedule new notifications
        await this.scheduleContestNotifications(contestId, newStartTime);
    }

    /**
     * Create a scheduled event using AWS Scheduler
     */
    private async createScheduledEvent(
        contestId: string,
        triggerName: 'wtr_wednesday_reminder' | 'team_not_submitted_final_hours',
        triggerTime: Date
    ): Promise<void> {
        const scheduleName = this.getScheduleName(contestId, triggerName);

        try {
            // Debug log role ARN
            console.log(`Using Execution Role ARN: ${process.env.SCHEDULER_EXECUTION_ROLE_ARN || 'undefined'}`);

            // Create the target configuration
            const target: Target = {
                Arn: this.getHttpTargetArn(),
                RoleArn: process.env.SCHEDULER_EXECUTION_ROLE_ARN,
                Input: JSON.stringify({
                    body: JSON.stringify({
                        contestId,
                        triggerName
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
                EventBridgeParameters: {
                    DetailType: "sasas",
                    Source: "qwerty"
                }
            };

            triggerTime.setSeconds(0, 0);
            const scheduleTime = triggerTime.toISOString().slice(0, 19); // "2025-06-04T05:05:00"
            const scheduleExpression = `at(${scheduleTime})`;

            const scheduleConfig = {
                Name: scheduleName,
                ActionAfterCompletion: ActionAfterCompletion.DELETE,
                GroupName: this.scheduleGroup,
                ScheduleExpression: scheduleExpression,
                Target: target,
                State: ScheduleState.ENABLED,
                Description: `Contest notification for ${triggerName}`,
                FlexibleTimeWindow: {
                    Mode: FlexibleTimeWindowMode.OFF
                }
            };


            console.log("Creating schedule with config:", JSON.stringify(scheduleConfig, null, 2));

            // Create the schedule
            const response = await this.schedulerClient.send(new CreateScheduleCommand(scheduleConfig));

            console.log(`Scheduled event created: ${scheduleName} at ${triggerTime.toISOString()}`);
            console.log("AWS Response:", JSON.stringify(response, null, 2));
        } catch (error) {
            console.error(`Error creating scheduled event ${scheduleName}:`, error);
            if (error.name === 'AccessDeniedException') {
                console.error('You do not have permission to create schedules. Check your IAM roles and policies.');
            } else if (error.name === 'ValidationException') {
                console.error('Validation error. Check your schedule configuration parameters.');
            } else if (error.name === 'ServiceQuotaExceededException') {
                console.error('Service quota exceeded. You may have reached your limit for schedules.');
            } else if (error.name === 'ConflictException') {
                console.error('A schedule with this name already exists.');
            } else if (error.name === 'ResourceNotFoundException') {
                console.error('Schedule group not found. Make sure it exists in the specified region.');
            }
            throw error;
        }
    }

    /**
     * Delete a scheduled event
     */
    private async deleteScheduledEvent(scheduleName: string): Promise<void> {
        try {
            await this.schedulerClient.send(new DeleteScheduleCommand({
                Name: scheduleName,
                GroupName: this.scheduleGroup
            }));

            console.log(`Scheduled event deleted: ${scheduleName}`);
        } catch (error) {
            // Log error but don't throw - schedule might not exist
            console.warn(`Error deleting scheduled event ${scheduleName}:`, error);
        }
    }

    /**
     * Generate schedule name for a contest notification
     */
    private getScheduleName(contestId: string, triggerName: string): string {
        // return `contest-notification-${contestId}-${triggerName}`.toLowerCase();
        return `contest-notification-${triggerName}`.toLowerCase();
    }

    /**
     * Get HTTP target ARN - you might need to adjust this based on your setup
     */
    private getHttpTargetArn(): string {
        // For HTTP endpoints with AWS Scheduler
        return this.notificationEndpointARN;
    }
}

// Singleton instance
let schedulerService: SchedulerContestService | null = null;

export function getSchedulerService(): SchedulerContestService {
    if (!schedulerService) {
        const notificationEndpointARN = process.env.SCHEDULER_HTTP_ENDPOINT_ARN;
        if (!notificationEndpointARN) {
            throw new Error('SCHEDULER_HTTP_ENDPOINT_ARN environment variable is required');
        }
        console.log("Notification Endpoint from getSchedulerService: ", notificationEndpointARN);

        schedulerService = new SchedulerContestService(
            process.env.AWS_REGION || 'eu-north-1',
            notificationEndpointARN,
            process.env.SCHEDULER_GROUP_NAME || 'default'
        );

        console.log("AWS Scheduler Service initialized from getSchedulerService");
    }
    return schedulerService;
} 