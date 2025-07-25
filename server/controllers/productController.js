const Product = require('../models/Product');

// Public route: get all approved products or filter by category
exports.getProducts = async (req, res) => {
  const { category } = req.query;
  const filter = { approved: true };
  if (category) filter.category = category;

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get products' });
  }
};

// Public route: get product details (only approved products or seller/admin owners)
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!product.approved) {
      // Only allow seller who owns it or admin
      if (!req.user || (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
        return res.status(403).json({ message: 'Not authorized to view this product' });
      }
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get product' });
  }
};

// Seller's products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get your products' });
  }
};

// Add product (seller only)
exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, category, images } = req.body;
  try {
    const product = new Product({
      seller: req.user._id,
      sellerUsername: req.user.username,
      name,
      description,
      price,
      quantity,
      category,
      images,
      approved: false, // needs admin approval
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// Edit product (seller only and owner only)
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category, images } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price != null ? price : product.price;
    product.quantity = quantity != null ? quantity : product.quantity;
    product.category = category || product.category;
    product.images = images || product.images;

    // Editing product sets approval back to false (needs reapproval)
    product.approved = false;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit product' });
  }
};

// Delete product (seller only and owner only)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};