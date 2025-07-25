const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Get all products (including unapproved)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get products' });
  }
};

// Approve product listing
exports.approveProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.approved = true;
    await product.save();

    res.json({ message: 'Product approved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve product' });
  }
};

// Reject product listing (delete)
exports.rejectProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product rejected and deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject product' });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};