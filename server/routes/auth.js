const express = require('express');
const { check } = require('express-validator');
const validateRequest = require('../utils/validateRequest');

const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup',
  [
    check('username').isLength({ min: 3 }).withMessage('Username at least 3 chars'),
    check('password').isLength({ min: 6 }).withMessage('Password at least 6 chars'),
    check('role').isIn(['buyer', 'seller']).withMessage('Role must be buyer or seller'),
  ],
  validateRequest,
  signup
);

router.post('/login',
  [
    check('username').not().isEmpty(),
    check('password').not().isEmpty(),
  ],
  validateRequest,
  login
);

module.exports = router;