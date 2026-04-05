require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bees', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('products');

    try {
      await collection.dropIndex('sku_1');
      console.log('✓ Dropped old sku_1 index');
    } catch (err) {
      if (err.message.includes('index not found')) {
        console.log('✓ Index does not exist');
      } else {
        throw err;
      }
    }

    // Re-create collection index with sparse option
    await collection.createIndex({ sku: 1 }, { sparse: true, unique: true });
    console.log('✓ Created new sparse sku index');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
