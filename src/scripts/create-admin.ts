import { sequelize } from '../db.js';
import { Admin } from '../entities/admin.entity.js';
import * as readline from 'readline';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdminInteractively() {
  try {
    // Display welcome message
    console.log('='.repeat(50));
    console.log('👤 WTR Admin - Admin Account Creation Tool 👤');
    console.log('='.repeat(50));
    console.log('This tool will help you create or update an admin account.');
    console.log('Press Ctrl+C at any time to exit.\n');
    
    // Initialize database
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');
    
    // Get admin information from user input
    const email = await question('📧 Enter admin email: ');
    if (!email || !email.includes('@')) {
      console.error('❌ Error: Valid email is required!');
      return;
    }
    
    const password = await question('🔑 Enter admin password (min 8 characters): ');
    if (!password || password.length < 8) {
      console.error('❌ Error: Password must be at least 8 characters long!');
      return;
    }
    
    const passwordConfirm = await question('🔑 Confirm password: ');
    if (password !== passwordConfirm) {
      console.error('❌ Error: Passwords do not match!');
      return;
    }
    
    let roleOption = await question('👑 Select role (1 for admin, 2 for superadmin): ');
    const role = roleOption === '2' ? 'superadmin' : 'admin';
    
    const name = await question('📝 Enter admin name: ');
    if (!name) {
      console.log('⚠️ Warning: Using default name "Admin User"');
    }
    
    console.log('\n📋 Summary:');
    console.log('='.repeat(50));
    console.log('- Email:', email);
    console.log('- Password:', '********');
    console.log('- Role:', role === 'superadmin' ? '👑 Superadmin' : '👤 Admin');
    console.log('- Name:', name || 'Admin User');
    console.log('='.repeat(50));
    
    const confirmation = await question('\n🔄 Confirm creation? (yes/no): ');
    if (confirmation.toLowerCase() !== 'yes') {
      console.log('❌ Admin creation canceled');
      return;
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      console.log(`⚠️ Admin with email ${email} already exists.`);
      const updateConfirm = await question('🔄 Do you want to update this admin? (yes/no): ');
      
      if (updateConfirm.toLowerCase() !== 'yes') {
        console.log('❌ Admin update canceled');
        return;
      }
      
      // Update the existing admin
      await existingAdmin.update({
        name: name || existingAdmin.name,
        password: password, // Will be hashed by model hooks
        role,
        isActive: true
      });
      
      console.log('✅ Admin updated successfully');
      console.log('- ID:', existingAdmin.id);
      console.log('- Email:', email);
      console.log('- Role:', role);
      
    } else {
      // Create a new admin
      const admin = await Admin.create({
        name: name || 'Admin User',
        email,
        password, // Will be hashed by model hooks
        role,
        isActive: true,
      });
      
      console.log('✅ Admin created successfully');
      console.log('- ID:', admin.id);
      console.log('- Email:', email);
      console.log('- Role:', role);
      
      // Fetch the admin to verify
      const savedAdmin = await Admin.findOne({ where: { email } });
      
      if (savedAdmin) {
        console.log('✅ Verified: Admin exists in database');
      } else {
        console.log('⚠️ Warning: Could not verify admin in database');
      }
    }
    
    console.log('\n🔄 Do you want to create another admin? (yes/no): ');
    const createAnother = await question('');
    
    if (createAnother.toLowerCase() === 'yes') {
      // Clear the console for a better experience
      console.clear();
      return createAdminInteractively();
    }
    
    console.log('\n👋 Thank you for using WTR Admin Account Creation Tool!');
    console.log('You can now log in with the created credentials.');
    
  } catch (error) {
    console.error('❌ Error creating/updating admin:', error);
  } finally {
    // Close the readline interface and database connection
    rl.close();
    await sequelize.close();
  }
}

// Run the function
createAdminInteractively(); 