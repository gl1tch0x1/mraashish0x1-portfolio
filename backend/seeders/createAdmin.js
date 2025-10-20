const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    // Delete ALL existing users first
    const deletedCount = await User.deleteMany({});
    if (deletedCount.deletedCount > 0) {
      console.log(`Deleted ${deletedCount.deletedCount} existing user(s)`.yellow);
    }

    // Create the single admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@mraashish0x1.com',
      password: '#H3ll0th3r3!',
      role: 'admin'
    });

    console.log('Admin user created successfully!'.green.inverse);
    console.log('');
    console.log('Login Credentials:'.cyan.bold);
    console.log('Email: admin@mraashish0x1.com'.cyan);
    console.log('Password: #H3ll0th3r3!'.cyan);
    console.log('');
    console.log('⚠️  This is the ONLY admin user in the system.'.yellow.bold);
    console.log('');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

createAdmin();

