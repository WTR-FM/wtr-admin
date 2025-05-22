// import { Sequelize } from 'sequelize-typescript';
import { sequelize } from '../db.js';
import { Notification } from '../entities/notification.entity.js';
// import { TeamSubmission } from '../../src/notifications/team-submission.entity';
// import { User } from '../../src/users/user.entity';

/**
 * Script to populate notification templates for testing
 * 
 * Run this script using:
 * npx ts-node -r tsconfig-paths/register src/notifications/test/create-notification-templates.ts
 */
async function createNotificationTemplates() {
  console.log('Starting to create notification templates...');

  try {
    // Ensure database connection is established
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Connect to database
    // const sequelize = new Sequelize({
    //   dialect: 'postgres',
    //   host: process.env.DB_HOST || 'localhost',
    //   port: parseInt(process.env.DB_PORT || '5432'),
    //   username: process.env.DB_USERNAME || 'wtr',
    //   password: process.env.DB_PASSWORD || 'wtr',
    //   database: process.env.DB_NAME || 'wtr_local_db',
    //   logging: console.log,
    // });

    // Add models
    // sequelize.addModels([Notification, TeamSubmission, User]);

    // Template data
    const templates = [
      {
        triggerName: 'wtr_wednesday_reminder',
        description: 'Reminder email sent 7 hours before deadline to users who haven\'t submitted',
        template: {
          email: {
            subject: '⏰ Last Chance: Submit Your WTR Team Before Deadline',
            body: `
              <html>
                <body>
                  <p>Hello {{firstName}},</p>
                  <p>This is a friendly reminder that you have 7 hours left to submit your WTR team for this week's challenge.</p>
                  <p>Don't miss out on the opportunity to earn XP and climb the leaderboard!</p>
                  <p>Click <a href="https://dev.wtr.fm">here</a> to submit your team now.</p>
                  <p>Best regards,<br>The WTR Team</p>
                </body>
              </html>
            `,
          },
          push: {
            subject: '⏰ Last Chance: Submit Your WTR Team Before Deadline',
            body: 'You have 7 hours left to submit your team for this week\'s challenge.',
          },
        },
      },
      {
        triggerName: 'wtr_results_email',
        description: 'Results email sent Wednesday morning to users who submitted a team',
        template: {
          email: {
            subject: 'Your WTR Results Are Ready! See Your XP Gains',
            body: `
              <html>
                <body>
                  <p>Hello {{firstName}},</p>
                  <p>Great job submitting your team for this week's WTR challenge!</p>
                  <p>Your results are now available. Click <a href="https://dev.wtr.fm">here</a> to see how your team performed and the XP you've earned.</p>
                  <p>Keep up the good work!</p>
                  <p>Best regards,<br>The WTR Team</p>
                </body>
              </html>
            `,
          },
          push: {
            subject: 'Your WTR Results Are Ready! See Your XP Gains',
            body: 'Check out your team performance and XP gains for this week\'s challenge.',
          },
        },
      },
      {
        triggerName: 'team_not_submitted_final_hours',
        description: 'Urgent reminder sent 2 hours before deadline to users who still haven\'t submitted',
        template: {
          email: {
            subject: '⚠️ 2 Hours Left: Don\'t Miss This Week\'s WTR Challenge',
            body: `
              <html>
                <body>
                  <p>Hello {{firstName}},</p>
                  <p><strong>This is your final reminder!</strong> You have only 2 hours left to submit your team for this week's WTR challenge.</p>
                  <p>Don't miss out on the opportunity to earn XP and rewards!</p>
                  <p>Click <a href="https://dev.wtr.fm">here</a> to submit your team now.</p>
                  <p>Best regards,<br>The WTR Team</p>
                </body>
              </html>
            `,
          },
          push: {
            subject: '⚠️ 2 Hours Left: Don\'t Miss This Week\'s WTR Challenge',
            body: 'Final reminder: Only 2 hours left to submit your team for this week\'s challenge!',
          },
        },
      }
    ];

    // Process each template
    for (const templateData of templates) {
      const { triggerName } = templateData;
      
      // Check if template already exists
      const existingTemplate = await Notification.findOne({ where: { triggerName } });
      
      if (existingTemplate) {
        // Update existing template
        console.log(`Updating existing template: ${triggerName}`);
        await existingTemplate.update(templateData);
      } else {
        // Create new template
        console.log(`Creating new template: ${triggerName}`);
        await Notification.create(templateData);
      }
    }

    console.log('Successfully processed notification templates!');
    
  } catch (error) {
    console.error('Error creating notification templates:', error);
  } finally {
    process.exit(0);
  }
}

// Run the function
createNotificationTemplates(); 