const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerUsername: { type: String, required: true }, // store username to simplify admin views
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 1000, default: '' },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, maxlength: 50 },
  images: [{ type: String }], // Array of image URLs
  approved: { type: Boolean, default: false }, // requires admin approval
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);