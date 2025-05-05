import Interaction from '../models/Interaction.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Placeholder for later use:
// export const getMatches = async (req, res) => { /* ... */ };

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
export const respondToInteraction = async (req, res) => { // NEW Function
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
    
    // Save and populate the response data
    await interaction.save();
    const populatedInteraction = await Interaction.findById(interaction._id)
      .populate('participants', 'username avatarUrl online');
    
    res.status(200).json({ status: "success", data: populatedInteraction }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};