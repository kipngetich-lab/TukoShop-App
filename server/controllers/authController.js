const User = require('../models/User');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.signup = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Please provide username, password, and role.' });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Role must be buyer or seller' });
    }

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password.' });
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials username' });

    //const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword);
    //const match = await bcrypt.compare(password,user.password);
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials password' });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
    console.log(err.message);

  }
};