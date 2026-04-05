require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const userId = process.argv[2] || '69d2258ade5ceaa4ada7f8cc';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bees', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const result = await User.updateOne(
      { _id: userId },
      { role: 'admin' }
    );
    console.log('✓ Updated:', result.modifiedCount === 1 ? 'Successfully set role to admin' : 'No user found');

    const user = await User.findById(userId);
    console.log('✓ User role:', user?.role);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
