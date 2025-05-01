import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  interaction_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interaction', 
    required: true 
  },
  rated_user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  rating_user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  helpfulness: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  politeness: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  comment: { 
    type: String, 
    maxlength: 500 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound unique index to prevent a user from rating the same interaction twice
ratingSchema.index({ interaction_id: 1, rating_user_id: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;