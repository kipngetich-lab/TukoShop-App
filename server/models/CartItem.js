const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
}, {
  timestamps: true,
});

cartItemSchema.index({ buyer: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);