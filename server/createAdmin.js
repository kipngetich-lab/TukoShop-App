require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust path if needed

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/2-localmarket-db';

async function createAdmin() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const username = 'admin';
  const password = '123456';  // Change password before running!
  const existing = await User.findOne({ username });

  if (existing) {
    console.log('Admin user already exists');
    process.exit(0);
  }

  //const hashedPassword = await bcrypt.hash(password, 10);
  //password:hashedPassword,
  const adminUser = new User({
    username,
    password,
    role: 'admin'
  });

  await adminUser.save();
  console.log('Admin user created:', username);
  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});