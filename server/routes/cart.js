const express = require('express');
const { check } = require('express-validator');
const validateRequest = require('../utils/validateRequest');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('buyer'));

router.get('/', getCart);

router.post('/',
  [
    check('productId').notEmpty().isMongoId(),
    check('quantity').isInt({ min: 1 }),
  ],
  validateRequest,
  addToCart
);

router.put('/',
  [
    check('productId').notEmpty().isMongoId(),
    check('quantity').isInt({ min: 1 }),
  ],
  validateRequest,
  updateCartItem
);

router.delete('/:productId', removeCartItem);

module.exports = router;