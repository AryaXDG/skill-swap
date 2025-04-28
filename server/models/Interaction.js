import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  status: { 
    type: String, 
    enum: ['pending', 'matched', 'completed', 'declined'], 
    default: 'pending' 
  },
  initiated_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastMessageAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;