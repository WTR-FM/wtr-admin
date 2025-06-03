import { 
    SchedulerClient, 
    CreateScheduleCommand, 
    DeleteScheduleCommand, 
    UpdateScheduleCommand,
    ScheduleState,
    Target
} from '@aws-sdk/client-scheduler';

export interface ContestNotificationEvent {
    contestId: string;
    triggerName: 'BEFORE_7_HOUR' | 'BEFORE_2_HOUR';
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
                this.createScheduledEvent(contestId, 'BEFORE_7_HOUR', sevenHoursBefore)
            );
            console.log("Scheduled 7 hours notification with AWS Scheduler");
        }

        // Schedule 2-hour notification if it's at least 2 hours in the future
        if (twoHoursBefore.getTime() > nowMs) {
            promises.push(
                this.createScheduledEvent(contestId, 'BEFORE_2_HOUR', twoHoursBefore)
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
            this.getScheduleName(contestId, 'BEFORE_7_HOUR'),
            this.getScheduleName(contestId, 'BEFORE_2_HOUR')
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
        triggerName: 'BEFORE_7_HOUR' | 'BEFORE_2_HOUR',
        triggerTime: Date
    ): Promise<void> {
        const scheduleName = this.getScheduleName(contestId, triggerName);
        
        try {
            // Create the target configuration
            const target: any = {
                Arn: this.getHttpTargetArn(), // This must be an EventBridge Endpoint ARN
                RoleArn: process.env.SCHEDULER_EXECUTION_ROLE_ARN,
                Input: JSON.stringify({
                    contestId,
                    triggerName,
                    startTime: triggerTime.toISOString(),
                    timestamp: new Date().toISOString(),
                    endpoint: this.notificationEndpointARN
                }),
                HttpParameters: {
                    HeaderParameters: {
                        'Content-Type': 'application/json'
                    },
                    Body: JSON.stringify({
                        contestId,
                        triggerName,
                        startTime: triggerTime.toISOString(),
                        timestamp: new Date().toISOString(),
                        endpoint: this.notificationEndpointARN
                    }),
                    Method: 'POST'
                }
            };

            // Create the schedule
            await this.schedulerClient.send(new CreateScheduleCommand({
                Name: scheduleName,
                GroupName: this.scheduleGroup,
                ScheduleExpression: `at(${triggerTime.toISOString().replace(/\.\d+Z$/, 'Z')})`, // AWS Scheduler at() expression format
                Target: target,
                State: ScheduleState.ENABLED,
                Description: `Contest notification for ${triggerName}`,
                FlexibleTimeWindow: {
                    Mode: 'OFF' // Exact time execution
                }
            }));

            console.log(`Scheduled event created: ${scheduleName} at ${triggerTime.toISOString()}`);
        } catch (error) {
            console.error(`Error creating scheduled event ${scheduleName}:`, error);
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
        return `contest-notification-${contestId}-${triggerName}`.toLowerCase();
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