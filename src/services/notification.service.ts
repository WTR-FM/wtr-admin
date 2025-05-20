import { Notification } from '../entities/notification.entity.js';

/**
 * Service for handling notification operations
 */
export class NotificationService {
  /**
   * Gets a notification template by trigger name
   * @param triggerName The unique identifier for the notification trigger
   * @returns The notification template or null if not found
   */
  static async getTemplateByTrigger(triggerName: string): Promise<Notification | null> {
    try {
      return await Notification.findOne({
        where: { triggerName }
      });
    } catch (error) {
      console.error(`Error getting notification template for trigger '${triggerName}':`, error);
      return null;
    }
  }

  /**
   * Sends an email notification using the specified template and replacements
   * @param triggerName The trigger name to identify the notification template
   * @param replacements Object with key-value pairs to replace placeholders in template
   * @param recipient Email address of the recipient
   * @returns Success status of the operation
   */
  static async sendEmailNotification(
    triggerName: string,
    replacements: Record<string, string> = {},
    recipient: string
  ): Promise<boolean> {
    try {
      // Get the notification template
      const notification = await this.getTemplateByTrigger(triggerName);
      if (!notification) {
        console.error(`No notification template found for trigger '${triggerName}'`);
        return false;
      }

      // Get email template
      const emailTemplate = notification.template.email;
      if (!emailTemplate) {
        console.error(`Email template not defined for trigger '${triggerName}'`);
        return false;
      }

      // Replace placeholders in subject and body
      let subject = emailTemplate.subject;
      let body = emailTemplate.body;

      // Replace all placeholders like {{name}} with their values
      Object.entries(replacements).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(placeholder, value);
        body = body.replace(placeholder, value);
      });

      // Here you would integrate with your email provider (SendGrid, Mailgun, etc.)
      console.log(`Sending email to ${recipient}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);

      // For now, just log that we would send the email
      // In a real implementation, you would call your email provider's API here
      
      return true;
    } catch (error) {
      console.error(`Error sending email notification for trigger '${triggerName}':`, error);
      return false;
    }
  }

  /**
   * Sends a push notification using the specified template and replacements
   * @param triggerName The trigger name to identify the notification template
   * @param replacements Object with key-value pairs to replace placeholders in template
   * @param deviceIds Array of device IDs to send the push notification to
   * @returns Success status of the operation
   */
  static async sendPushNotification(
    triggerName: string,
    replacements: Record<string, string> = {},
    deviceIds: string[]
  ): Promise<boolean> {
    try {
      // Get the notification template
      const notification = await this.getTemplateByTrigger(triggerName);
      if (!notification) {
        console.error(`No notification template found for trigger '${triggerName}'`);
        return false;
      }

      // Get push template
      const pushTemplate = notification.template.push;
      if (!pushTemplate) {
        console.error(`Push template not defined for trigger '${triggerName}'`);
        return false;
      }

      // Replace placeholders in subject and body
      let subject = pushTemplate.subject;
      let body = pushTemplate.body;

      // Replace all placeholders like {{name}} with their values
      Object.entries(replacements).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(placeholder, value);
        body = body.replace(placeholder, value);
      });

      // Here you would integrate with your push notification provider (Firebase, OneSignal, etc.)
      console.log(`Sending push notification to ${deviceIds.length} devices`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);

      // For now, just log that we would send the push notification
      // In a real implementation, you would call your push notification provider's API here
      
      return true;
    } catch (error) {
      console.error(`Error sending push notification for trigger '${triggerName}':`, error);
      return false;
    }
  }
} 