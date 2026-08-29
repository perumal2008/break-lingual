const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_super_secret_key';

// Mock OAuth logic for hackathon MVP. 
// In production, we would verify a Google/GitHub token here.
exports.socialLogin = async (req, res) => {
  try {
    const { email, name, provider, providerId } = req.body;

    if (!email || !provider) {
      return res.status(400).json({ error: 'Email and provider are required' });
    }

    let user;

    // Check if MongoDB is connected, else use mock response
    try {
      user = await User.findOne({ email });

      if (user) {
        // Update last login
        user.lastLogin = Date.now();
        await user.save();
      } else {
        // Create new user
        user = new User({
          name: name || email.split('@')[0],
          email,
          authProvider: provider,
          providerId: providerId || `mock-${Date.now()}`
        });
        await user.save();
      }
    } catch (dbError) {
      console.warn("DB not connected, bypassing user save:", dbError.message);
      user = {
        _id: 'mock-id-12345',
        name: name || email.split('@')[0],
        email,
        authProvider: provider
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.authProvider
      }
    });

  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
