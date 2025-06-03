import User from '../models/User.js';
import Rating from '../models/Rating.js';

// @desc    Get public user profile
// @route   GET /api/users/:userId
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-passwordHash -email')
      .populate('skills_possessed.skill')
      .populate('skills_seeking.skill');

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const ratings = await Rating.find({ rated_user_id: req.params.userId })
        .populate('rating_user_id', 'username avatarUrl')
        .sort({ createdAt: -1 });

    res.status(200).json({ 
      status: "success", 
      data: {
        user,
        ratings
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Update user profile (bio, avatar)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { bio, avatarUrl } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.bio = bio || user.bio;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      
      const updatedUser = await user.save();
      const userResponse = updatedUser.toObject();
      delete userResponse.passwordHash;

      res.status(200).json({ status: "success", data: userResponse });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Update user skills
// @route   PUT /api/users/profile/skills
// @access  Private
export const updateUserSkills = async (req, res) => {
  const { skills_possessed, skills_seeking } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Overwrite the skill arrays
      user.skills_possessed = skills_possessed;
      user.skills_seeking = skills_seeking;

      await user.save();
      
      const updatedUser = await User.findById(req.user._id)
        .select('-passwordHash')
        .populate('skills_possessed.skill')
        .populate('skills_seeking.skill');

      res.status(200).json({ status: "success", data: updatedUser });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};