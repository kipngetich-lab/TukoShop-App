const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { placeOrder, getOrders } = require('../controllers/orderController');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('buyer'));

router.post('/', placeOrder);
router.get('/', getOrders);

module.exports = router;