const express = require('express');
const { check } = require('express-validator');
const validateRequest = require('../utils/validateRequest');
const {
	getProducts,
	getProductById,
	getMyProducts,
	addProduct,
	editProduct,
	deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', protect, getProductById); // Protect to allow role check for unapproved products

// Seller routes
router.get('/mine', protect, authorizeRoles('seller'), getMyProducts);

router.post('/',
	protect,
	authorizeRoles('seller'),
	[
		check('name').notEmpty(),
		check('price').isFloat({ gt: 0 }),
		check('quantity').isInt({ min: 0 }),
		check('category').notEmpty(),
		check('images').isArray(),
	],
	validateRequest,
	addProduct
);

router.put('/:id',
	protect,
	authorizeRoles('seller'),
	[
		check('name').optional().notEmpty(),
		check('price').optional().isFloat({ gt: 0 }),
		check('quantity').optional().isInt({ min: 0 }),
		check('category').optional().notEmpty(),
		check('images').optional().isArray(),
	],
	validateRequest,
	editProduct
);

router.delete('/:id', protect, authorizeRoles('seller'), deleteProduct);

module.exports = router;