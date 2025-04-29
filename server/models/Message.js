import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  interaction_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interaction', 
    required: true, 
    index: true 
  },
  sender_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true, 
    trim: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;