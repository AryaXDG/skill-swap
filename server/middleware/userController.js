import User from '../models/User.js';
// Skill import is not needed since the User model populates it, but we can assume it's available or not fully implemented here.

// @desc    Get public user profile
// @route   GET /api/users/:userId
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-passwordHash -email')
      .populate('skills_possessed.skill') // Populating skills since they are in the schema (Commit 11)
      .populate('skills_seeking.skill');

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // NOTE: Rating retrieval logic is not included here, as the Rating model (and its controller logic) is added later.

    res.status(200).json({ 
      status: "success", 
      data: {
        user,
        // ratings: [] // Placeholder if required, but omitted for purity
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Update user profile (bio, avatar)
// @route   PUT /api/users/profile
// @access  Private (Needs Auth, which is partially implemented)
export const updateUserProfile = async (req, res) => {
  // Authentication is in place (Commit 7, 12), so we assume req.user is available.
  const { bio, avatarUrl } = req.body;

  try {
    const user = await User.findById(req.user._id); // Requires req.user from authMiddleware

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

// Placeholder for later use:
// export const updateUserSkills = async (req, res) => { /* ... */ };