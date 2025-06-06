import { sequelize } from '../db.js';
import { Notification } from '../entities/notification.entity.js';
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

    // Template data
    const templates = [
      {
        triggerName: 'wtr_wednesday_reminder',
        description: 'Reminder email sent 7 hours before deadline to users who haven\'t submitted',
        template: {
          email: {
            subject: '⏰ Time\'s Running Out - Submit Your WTR Team Now!',
            body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WTR Countdown Reminder</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #120F20; font-family: Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #120F20;">
        <tr>
            <td align="center" style="padding: 30px 15px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #1E1A2E; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #352A64; padding: 30px; text-align: center; border-bottom: 1px solid #463B80;">
                            <img src="https://via.placeholder.com/150x50/352A64/FFFFFF?text=WTR" alt="WTR Logo" width="150" height="50" style="display: block; margin: 0 auto 15px;">
                            <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 0; line-height: 1.3;">Time's Running Out!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #e0e0e0;">
                            <h2 style="font-size: 22px; color: #fff; margin-top: 0; margin-bottom: 20px;">The countdown is on...</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #c4c4c4; margin: 0 0 20px;">Hello {{firstName}}, don't miss your chance to participate in this week's What's The Record challenge.</p>
                            
                            <!-- Timer -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                <tr>
                                    <td style="background-color: #352A64; border-radius: 12px; padding: 25px; text-align: center; border: 1px solid #463B80;">
                                        <div style="font-size: 42px; font-weight: bold; color: #B19CFF; margin: 10px 0;">7</div>
                                        <div style="text-transform: uppercase; font-size: 14px; color: #c4c4c4; letter-spacing: 1px;">Hours Remaining</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #c4c4c4; margin: 0 0 20px;">Head to the WTR app now and make your picks before the Tuesday 11:59 PM ET deadline. Stay in the game and keep climbing the leaderboard!</p>
                            
                            <!-- Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://app.wtr.fm/team-selection" style="display: inline-block; background-color: #A374FF; color: white; padding: 16px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Pick My Team Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #14101F; padding: 25px; text-align: center; border-top: 1px solid #352A64;">
                            <p style="font-size: 13px; color: #888; margin: 0;">You're receiving this because you have a WTR account.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`,
          },
          push: {
            subject: '⏰ Time\'s Running Out - Submit Your WTR Team Now!',
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
            body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WTR Results</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #120F20; font-family: Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #120F20;">
        <tr>
            <td align="center" style="padding: 30px 15px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #1E1A2E; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #352A64; padding: 30px; text-align: center; border-bottom: 1px solid #463B80;">
                            <img src="https://via.placeholder.com/150x50/352A64/FFFFFF?text=WTR" alt="WTR Logo" width="150" height="50" style="display: block; margin: 0 auto 15px;">
                            <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 0; line-height: 1.3;">This Week's Results</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #e0e0e0;">
                            <h2 style="font-size: 22px; color: #fff; margin-top: 0; margin-bottom: 20px;">Your Weekly Results Are In!</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #c4c4c4; margin: 0 0 20px;">Hello {{firstName}}, thanks for participating in this week's What's The Record challenge! Check out how your team performed:</p>
                            
                            <!-- Results -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                <tr>
                                    <td style="background-color: #352A64; border-radius: 12px; padding: 25px; border-left: 4px solid #B19CFF;">
                                        <div style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 20px;">This Week's Performance</div>
                                        
                                        <!-- Results Grid -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="50%" style="text-align: center; padding-right: 15px;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #4CD964; margin-bottom: 5px;">+{{earnedXPs}}</div>
                                                    <div style="font-size: 14px; color: #c4c4c4; text-transform: uppercase; letter-spacing: 0.5px;">XP Earned</div>
                                                </td>
                                                <td width="50%" style="text-align: center; padding-left: 15px;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #B19CFF; margin-bottom: 5px;">{{totalXPs}}</div>
                                                    <div style="font-size: 14px; color: #c4c4c4; text-transform: uppercase; letter-spacing: 0.5px;">Total XP</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #c4c4c4; margin: 0 0 20px;">Ready to see the full breakdown of your performance and challenge choices?</p>
                            
                            <!-- Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://app.wtr.fm/team-summary" style="display: inline-block; background-color: #A374FF; color: white; padding: 16px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">View Full Results</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #14101F; padding: 25px; text-align: center; border-top: 1px solid #352A64;">
                            <p style="font-size: 13px; color: #888; margin: 0;">You're receiving this because you have a WTR account.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`,
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
            subject: '⚠️ URGENT: 2 Hours Left - Don\'t Miss This Week\'s WTR Challenge',
            body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WTR Urgent Reminder</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #120F20; font-family: Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #120F20;">
        <tr>
            <td align="center" style="padding: 30px 15px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #1E1A2E; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #3D2B54; padding: 30px; text-align: center; border-bottom: 1px solid #4F3B80;">
                            <img src="https://via.placeholder.com/150x50/3D2B54/FFFFFF?text=WTR" alt="WTR Logo" width="150" height="50" style="display: block; margin: 0 auto 15px;">
                            <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 0; line-height: 1.3;">URGENT: Team Submission Required</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #e0e0e0;">
                            <h2 style="font-size: 22px; color: #B974E0; margin-top: 0; margin-bottom: 20px;">Your WTR team is missing!</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #c4c4c4; margin: 0 0 20px;">Hello {{firstName}}, we noticed you haven't submitted your team for this week's challenge yet. Time is running out!</p>
                            
                            <!-- Alert -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                <tr>
                                    <td style="background-color: rgba(185, 116, 224, 0.15); border-radius: 12px; padding: 25px; text-align: center; border: 2px dashed rgba(185, 116, 224, 0.5);">
                                        <div style="font-size: 18px; font-weight: bold; color: #B974E0; margin-bottom: 15px;">FINAL COUNTDOWN</div>
                                        <div style="font-size: 42px; font-weight: bold; color: #B974E0; margin: 15px 0;">2</div>
                                        <div style="text-transform: uppercase; font-size: 14px; color: #B974E0; letter-spacing: 1px;">Hours Remaining</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #c4c4c4; margin: 0 0 20px;">No team submission means <strong style="color: #B974E0;">no XP earned</strong> this week. The deadline is tonight at 11:59 PM ET. Jump back into the WTR app and make your picks now!</p>
                            
                            <!-- Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://app.wtr.fm/team-selection" style="display: inline-block; background-color: #B974E0; color: white; padding: 16px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Submit My Team Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #14101F; padding: 25px; text-align: center; border-top: 1px solid #352A64;">
                            <p style="font-size: 13px; color: #888; margin: 0;">You're receiving this because you have a WTR account.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`,
          },
          push: {
            subject: '⚠️ URGENT: 2 Hours Left - Don\'t Miss This Week\'s WTR Challenge',
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