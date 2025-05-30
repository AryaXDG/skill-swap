import Interaction from '../models/Interaction.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get matched users (Core Logic)
// @route   GET /api/interactions/matches
// @access  Private
export const getMatches = async (req, res) => { 
  try {
    const userA = await User.findById(req.user._id).lean();
    if (!userA) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Get arrays of ObjectIds for skills
    const possessedSkillIds = userA.skills_possessed.map(s => s.skill);
    const seekingSkillIds = userA.skills_seeking.map(s => s.skill);

    if (possessedSkillIds.length === 0 || seekingSkillIds.length === 0) {
        return res.status(200).json({ status: "success", data: [] }); // No skills to match
    }

    // Use Aggregation Pipeline to find and score matches
    const matches = await User.aggregate([
      // 1. Find all users *except* the current user
      {
        $match: {
          _id: { $ne: userA._id }
        }
      },
      // 2. Add fields for their possessed/seeking skill IDs
      {
        $addFields: {
          user_possessed_skill_ids: { $map: { input: "$skills_possessed", as: "s", in: "$$s.skill" } },
          user_seeking_skill_ids: { $map: { input: "$skills_seeking", as: "s", in: "$$s.skill" } }
        }
      },
      // 3. Find the intersection between users
      {
        $addFields: {
          // Skills UserB has that I (UserA) am seeking
          matches_my_seeking: { $setIntersection: ["$user_possessed_skill_ids", seekingSkillIds] },
          // Skills UserB is seeking that I (UserA) have
          matches_my_possessed: { $setIntersection: ["$user_seeking_skill_ids", possessedSkillIds] }
        }
      },
      // 4. Count the intersections
      {
        $addFields: {
          matches_my_seeking_count: { $size: "$matches_my_seeking" },
          matches_my_possessed_count: { $size: "$matches_my_possessed" }
        }
      },
      // 5. Calculate total match score
      {
        $addFields: {
          match_score: { $add: ["$matches_my_seeking_count", "$matches_my_possessed_count"] }
        }
      },
      // 6. Filter *only* for reciprocal matches (both must be > 0)
      {
        $match: {
          matches_my_seeking_count: { $gt: 0 },
          matches_my_possessed_count: { $gt: 0 }
        }
      },
      // 7. Sort by the highest score
      {
        $sort: {
          match_score: -1
        }
      },
      // 8. Project final fields (remove sensitive data)
      {
        $project: {
          passwordHash: 0,
          email: 0,
          user_possessed_skill_ids: 0,
          user_seeking_skill_ids: 0,
          matches_my_seeking: 0,
          matches_my_possessed: 0,
        }
      }
    ]);
    
    // Populate the skills for the matched users
    await User.populate(matches, { 
        path: 'skills_possessed.skill skills_seeking.skill' 
    });

    res.status(200).json({ status: "success", data: matches });

  } catch (error) {
    console.error(error);
    // Handle specific CastError if user ID is invalid format
    if (error.name === 'CastError') {
      return res.status(400).json({ status: "error", message: "Invalid user ID format" });
    }
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Request an interaction
// @route   POST /api/interactions/request
// @access  Private
export const requestInteraction = async (req, res) => {
  const { receiver_id } = req.body;
  const initiator_id = req.user._id;

  if (receiver_id.toString() === initiator_id.toString()) {
    return res.status(400).json({ status: "error", message: "Cannot start interaction with yourself" });
  }

  try {
    // Check if an interaction (pending or matched) already exists
    const existingInteraction = await Interaction.findOne({
      participants: { $all: [initiator_id, receiver_id] },
      status: { $in: ['pending', 'matched'] }
    });

    if (existingInteraction) {
      return res.status(400).json({ status: "error", message: "Interaction already exists or is pending" });
    }

    const newInteraction = new Interaction({
      participants: [initiator_id, receiver_id],
      initiated_by: initiator_id,
      status: 'pending'
    });

    await newInteraction.save();
    res.status(201).json({ status: "success", data: newInteraction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Get all of user's interactions
// @route   GET /api/interactions
// @access  Private
export const getUserInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.find({ participants: req.user._id })
      .populate('participants', 'username avatarUrl online')
      .sort({ lastMessageAt: -1 });
      
    res.status(200).json({ status: "success", data: interactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// @desc    Respond to an interaction request (accept/decline)
// @route   PUT /api/interactions/:interactionId/respond
// @access  Private
export const respondToInteraction = async (req, res) => { 
  const { interactionId } = req.params;
  const { status } = req.body; 

  if (!['matched', 'declined'].includes(status)) { 
    return res.status(400).json({ status: "error", message: "Invalid response status" }); 
  }

  try {
    const interaction = await Interaction.findById(interactionId);

    if (!interaction) {
      return res.status(404).json({ status: "error", message: "Interaction not found" });
    }

    // Check if user is a participant and *not* the one who initiated it
    if (!interaction.participants.includes(req.user._id) || interaction.initiated_by.toString() === req.user._id.toString()) {
      return res.status(403).json({ status: "error", message: "Not authorized to respond to this request" });
    }
    
    if (interaction.status !== 'pending') {
        return res.status(400).json({ status: "error", message: "Interaction is not pending" });
    }

    interaction.status = status; 
    
    // --- Populating the response data (NEW) ---
    await interaction.save();
    const populatedInteraction = await Interaction.findById(interaction._id)
      .populate('participants', 'username avatarUrl online');
    // --- End of new code ---
    
    res.status(200).json({ status: "success", data: populatedInteraction }); // Sent populated data
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};