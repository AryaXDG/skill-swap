import Rating from '../models/Rating.js';
import Interaction from '../models/Interaction.js';
import User from '../models/User.js';
// import mongoose from 'mongoose'; // Not needed yet as aggregation is excluded

// @desc    Add a rating for an interaction
// @route   POST /api/ratings/:interactionId
// @access  Private
export const addRating = async (req, res) => {
  const { interactionId } = req.params;
  const { helpfulness, politeness, comment } = req.body;
  const rating_user_id = req.user._id;

  try {
    // 1. Find the interaction
    const interaction = await Interaction.findById(interactionId);
    if (!interaction) {
      return res.status(404).json({ status: "error", message: "Interaction not found" });
    }

    // 2. Check if user was a participant
    if (!interaction.participants.includes(rating_user_id)) {
      return res.status(403).json({ status: "error", message: "Not authorized" });
    }
    
    // 3. Determine who is being rated
    const rated_user_id = interaction.participants.find(
      (id) => id.toString() !== rating_user_id.toString()
    );

    if (!rated_user_id) {
        return res.status(400).json({ status: "error", message: "Cannot rate this interaction" });
    }

    // 4. Check if this user already rated this interaction
    const existingRating = await Rating.findOne({ 
      interaction_id: interactionId, 
      rating_user_id: rating_user_id 
    });

    if (existingRating) {
      return res.status(400).json({ status: "error", message: "You have already rated this interaction" });
    }

    // 5. Create new rating
    const rating = new Rating({
      interaction_id: interactionId,
      rated_user_id: rated_user_id,
      rating_user_id: rating_user_id,
      helpfulness,
      politeness,
      comment
    });

    await rating.save();
    
    // 6. --- Excluded Aggregation Logic (To be added later) ---
    // The code for fetching and updating user averages is skipped here.

    res.status(201).json({ status: "success", data: rating });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};