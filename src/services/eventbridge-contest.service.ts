import { EventBridgeClient, PutRuleCommand, PutTargetsCommand, DeleteRuleCommand, RemoveTargetsCommand, ListTargetsByRuleCommand } from '@aws-sdk/client-eventbridge';

export interface ContestNotificationEvent {
    contestId: string;
    triggerName: 'BEFORE_7_HOUR' | 'BEFORE_2_HOUR';
    startTime: Date;
}

export class EventBridgeContestService {
    private eventBridgeClient: EventBridgeClient;
    private notificationEndpoint: string;
    private eventBusName?: string;

    constructor(
        region: string = 'eu-north-1',
        notificationEndpoint: string,
        eventBusName?: string
    ) {
        const credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          };
        this.eventBridgeClient = new EventBridgeClient({ region, credentials});
        this.notificationEndpoint = notificationEndpoint;
        this.eventBusName = eventBusName;
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
            console.log("Pushed 7 hours notification in Event Bus");
        }

        // Schedule 2-hour notification if it's at least 2 hours in the future
        if (twoHoursBefore.getTime() > nowMs) {
            promises.push(
                this.createScheduledEvent(contestId, 'BEFORE_2_HOUR', twoHoursBefore)
            );
            console.log("Pushed 2 hours notification in Event Bus");
        }

        await Promise.all(promises);
    }

    /**
     * Remove existing notification events for a contest
     */
    async removeContestNotifications(contestId: string): Promise<void> {
        const ruleNames = [
            this.getRuleName(contestId, '7_HOUR'),
            this.getRuleName(contestId, '2_HOUR')
        ];

        const promises = ruleNames.map(ruleName => this.deleteScheduledEvent(ruleName));
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
     * Create a scheduled event rule and target
     */
    private async createScheduledEvent(
        contestId: string,
        triggerName: 'BEFORE_7_HOUR' | 'BEFORE_2_HOUR',
        triggerTime: Date
    ): Promise<void> {
        const ruleName = this.getRuleName(contestId, triggerName);
        
        // Create EventBridge rule with schedule expression
        const scheduleExpression = this.createScheduleExpression(triggerTime);
        
        try {
            // Create the rule
            await this.eventBridgeClient.send(new PutRuleCommand({
                Name: ruleName,
                ScheduleExpression: scheduleExpression,
                Description: `Contest notification for ${triggerName}`,
                State: 'ENABLED',
                EventBusName: this.eventBusName
            }));

            // Add target to the rule
            await this.eventBridgeClient.send(new PutTargetsCommand({
                Rule: ruleName,
                EventBusName: this.eventBusName,
                Targets: [{
                    Id: `contest-notification-${triggerName}`,
                    Arn: this.getHttpTargetArn(),
                    HttpParameters: {
                        HeaderParameters: {
                            'Content-Type': 'application/json'
                        },
                        QueryStringParameters: {}
                    },
                    RoleArn: process.env.EVENTBRIDGE_EXECUTION_ROLE_ARN, // Role with permissions to invoke HTTP endpoint
                    Input: JSON.stringify({
                        contestId,
                        triggerName,
                        startTime: triggerTime.toISOString(),
                        timestamp: new Date().toISOString(),
                        endpoint: this.notificationEndpoint // Include endpoint in payload
                    })
                }]
            }));

            console.log(`Scheduled event created: ${ruleName} at ${triggerTime.toISOString()}`);
        } catch (error) {
            console.error(`Error creating scheduled event ${ruleName}:`, error);
            throw error;
        }
    }

    /**
     * Delete a scheduled event rule and its targets
     */
    private async deleteScheduledEvent(ruleName: string): Promise<void> {
        try {
            // First, list and remove all targets
            const targetsResponse = await this.eventBridgeClient.send(new ListTargetsByRuleCommand({
                Rule: ruleName,
                EventBusName: this.eventBusName
            }));

            if (targetsResponse.Targets && targetsResponse.Targets.length > 0) {
                const targetIds = targetsResponse.Targets.map(target => target.Id!);
                await this.eventBridgeClient.send(new RemoveTargetsCommand({
                    Rule: ruleName,
                    EventBusName: this.eventBusName,
                    Ids: targetIds
                }));
            }

            // Then delete the rule
            await this.eventBridgeClient.send(new DeleteRuleCommand({
                Name: ruleName,
                EventBusName: this.eventBusName
            }));

            console.log(`Scheduled event deleted: ${ruleName}`);
        } catch (error) {
            // Log error but don't throw - rule might not exist
            console.warn(`Error deleting scheduled event ${ruleName}:`, error);
        }
    }

    /**
     * Generate rule name for a contest notification
     */
    private getRuleName(contestId: string, triggerName: string): string {
        return `contest-notification-${triggerName}`.toLowerCase();
    }

    /**
     * Create cron expression for EventBridge from Date
     */
    private createScheduleExpression(date: Date): string {
        const minute = date.getUTCMinutes();
        const hour = date.getUTCHours();
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // JavaScript months are 0-indexed
        const year = date.getUTCFullYear();

        // EventBridge uses 6-field cron expressions: minute hour day month dayOfWeek year
        return `cron(${minute} ${hour} ${day} ${month} ? ${year})`;
    }

    /**
     * Get HTTP target ARN - you might need to adjust this based on your setup
     */
    private getHttpTargetArn(): string {
        // For HTTP endpoints, EventBridge uses a specific ARN format
        // This assumes you're using EventBridge's HTTP endpoint integration
        return `arn:aws:events:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:destination/http-destination`;
    }
}

// Singleton instance
let eventBridgeService: EventBridgeContestService | null = null;

export function getEventBridgeService(): EventBridgeContestService {
    if (!eventBridgeService) {
        const notificationEndpoint = process.env.BACKEND_URL;
        if (!notificationEndpoint) {
            throw new Error('CONTEST_NOTIFICATION_ENDPOINT environment variable is required');
        }
        console.log("Notification Endpoint: ", notificationEndpoint);

        eventBridgeService = new EventBridgeContestService(
            process.env.AWS_REGION || 'eu-north-1',
            notificationEndpoint,
            process.env.EVENTBRIDGE_BUS_NAME
        );

        console.log("Event Bridge Service: ", eventBridgeService);
    }
    return eventBridgeService;
}