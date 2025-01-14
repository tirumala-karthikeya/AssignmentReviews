const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('-password'); // Use req.user.id
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
