import { getEventBridgeService } from './services/eventbridge-contest.service.js';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testScheduler() {
  try {
    console.log('------ Testing AWS EventBridge Scheduler ------');
    console.log('Environment variables:');
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set (first 5 chars: ' + process.env.AWS_ACCESS_KEY_ID.substring(0, 5) + '...)' : 'Not set');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set (length: ' + process.env.AWS_SECRET_ACCESS_KEY.length + ')' : 'Not set');
    console.log('SCHEDULER_HTTP_ENDPOINT_ARN:', process.env.SCHEDULER_HTTP_ENDPOINT_ARN);
    console.log('SCHEDULER_EXECUTION_ROLE_ARN:', process.env.SCHEDULER_EXECUTION_ROLE_ARN);
    console.log('SCHEDULER_GROUP_NAME:', process.env.SCHEDULER_GROUP_NAME || 'default');
    
    // Generate a unique contest ID for testing
    const testContestId = uuidv4();
    console.log(`\nCreating test schedules for contest ID: ${testContestId}`);
    
    // Set a start time 24 hours from now to ensure both notifications will be scheduled
    const startTime = new Date(Date.now() + (24 * 60 * 60 * 1000));
    console.log(`Test contest start time: ${startTime.toISOString()}`);
    
    // Get the scheduler service
    const eventBridge = getEventBridgeService();
    
    // Schedule notifications
    await eventBridge.scheduleContestNotifications(testContestId, startTime);
    
    console.log('\nTest completed successfully!');
    console.log('------------------------------------------');
    console.log('If you see successful schedule creation logs but no schedules in AWS console, check:');
    console.log('1. AWS credentials are correct and have EventBridge Scheduler permissions');
    console.log('2. You are looking in the correct region in AWS console');
    console.log('3. The schedule group exists in that region');
    console.log('4. Your execution role has permission to invoke the target endpoint');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testScheduler(); 