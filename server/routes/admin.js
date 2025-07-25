const express = require('express');
const { check } = require('express-validator');
const validateRequest = require('../utils/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getUsers,
  getProducts,
  approveProduct,
  rejectProduct,
  getOrders,
  updateOrderStatus,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

// Users management
router.get('/users', getUsers);

// Products management
router.get('/products', getProducts);
router.post('/products/:productId/approve', approveProduct);
router.post('/products/:productId/reject', rejectProduct);

// Orders management
router.get('/orders', getOrders);
router.put('/orders/:orderId', 
  [check('status').notEmpty().isIn(['Pending', 'Shipped', 'Delivered'])],
  validateRequest,
  updateOrderStatus);

module.exports = router;