const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Get buyer's cart items
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ buyer: req.user._id }).populate('product');
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart items' });
  }
};

// Add/update cart item
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1)
    return res.status(400).json({ message: 'Product ID and valid quantity required' });

  try {
    const product = await Product.findById(productId);
    if (!product || !product.approved) {
      return res.status(404).json({ message: 'Product not found or not approved' });
    }

    let cartItem = await CartItem.findOne({ buyer: req.user._id, product: productId });
    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      cartItem = new CartItem({ buyer: req.user._id, product: productId, quantity });
    }
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add/update cart item' });
  }
};

// Update quantity for cart item
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1)
    return res.status(400).json({ message: 'Product ID and valid quantity required' });

  try {
    const cartItem = await CartItem.findOne({ buyer: req.user._id, product: productId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;
  try {
    await CartItem.findOneAndDelete({ buyer: req.user._id, product: productId });
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
};