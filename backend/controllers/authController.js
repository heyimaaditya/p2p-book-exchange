const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { name, mobile, email, password, role } = req.body;
    if (!name || !mobile || !email || !password || !role) {
      return res.status(400).json({ msg: 'Please fill all fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, mobile, email, password: hashedPassword, role });
    const savedUser = await newUser.save();
    return res.status(201).json({ msg: 'Registration successful', user: savedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({
      msg: 'Login successful',
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};
