import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ status: "error", message: "User already exists" });
    }

    // The 'passwordHash' field in the model will be hashed by the pre-save hook
    const user = await User.create({
      username,
      email,
      passwordHash: password, 
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        status: "success",
        data: {
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            // Only basic profile fields are returned since they don't exist yet in the schema
            // We assume basic defaults are available or handled client-side for now.
            avatarUrl: 'default_avatar_url', // Placeholder from final User.js
            bio: '' // Placeholder from final User.js
          },
        },
      });
    } else {
      res.status(400).json({ status: "error", message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Placeholder for later use:
// export const loginUser = async (req, res) => { /* ... */ };
// export const getMe = async (req, res) => { /* ... */ };