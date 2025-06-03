import Message from '../models/Message.js';
import Interaction from '../models/Interaction.js';

// @desc    Get messages for an interaction
// @route   GET /api/messages/:interactionId
// @access  Private
export const getMessages = async (req, res) => {
  const { interactionId } = req.params;
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "50");
  const skip = (page - 1) * limit;

  try {
    // 1. Check if user is part of this interaction
    const interaction = await Interaction.findOne({
      _id: interactionId,
      participants: req.user._id
    });

    if (!interaction) {
      return res.status(403).json({ status: "error", message: "Not authorized to view these messages" });
    }

    // 2. Get messages
    const messages = await Message.find({ interaction_id: interactionId })
      .sort({ timestamp: -1 }) // Get newest first
      .skip(skip)
      .limit(limit)
      .populate('sender_id', 'username avatarUrl');
      
    // 3. Get total count for pagination
    const totalMessages = await Message.countDocuments({ interaction_id: interactionId });

    res.status(200).json({
      status: "success",
      data: messages.reverse(), // Reverse to show oldest first (chronological)
      pagination: {
        total: totalMessages,
        page,
        limit,
        totalPages: Math.ceil(totalMessages / limit)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};