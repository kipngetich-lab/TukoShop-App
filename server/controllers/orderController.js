const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ buyer: req.user._id }).populate('product');

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock quantities
    for (const item of cartItems) {
      if (item.quantity > item.product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
    }

    const products = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const order = new Order({
      buyer: req.user._id,
      buyerUsername: req.user.username,
      products,
      status: 'Pending',
    });

    await order.save();

    // Decrement product quantities
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.product._id,
        { $inc: { quantity: -item.quantity } });
    }

    // Clear cart
    await CartItem.deleteMany({ buyer: req.user._id });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// Get buyer's order history
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders' });
  }
};