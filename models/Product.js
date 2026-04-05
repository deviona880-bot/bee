const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  image: String,
  gallery: [String],
  stock: { type: Number, default: 0 },
  sku: { type: String, sparse: true }, // sparse allows multiple null values for unique index
  type: { type: String, enum: ['travaux_forestiers', 'cosmétiques', 'apiculture'], required: true },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Set sparse index on SKU to allow multiple null values
productSchema.index({ sku: 1 }, { sparse: true, unique: true });

module.exports = mongoose.model('Product', productSchema);
