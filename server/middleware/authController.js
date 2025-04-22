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
            avatarUrl: user.avatarUrl,
            bio: user.bio
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

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.status(200).json({
        status: "success",
        data: {
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio
          },
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Get user profile (current logged in)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .populate('skills_possessed.skill')
      .populate('skills_seeking.skill');
      
    if (user) {
      res.status(200).json({ status: "success", data: user });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};