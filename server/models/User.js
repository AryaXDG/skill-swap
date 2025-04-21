import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  avatarUrl: { // New Field
    type: String, 
    default: 'default_avatar_url' 
  },
  bio: { // New Field
    type: String, 
    maxlength: 500 
  },
  online: { // New Field (for Socket.IO tracking, though socket logic comes later)
    type: Boolean, 
    default: false 
  },
  skills_possessed: [{ // New Field
    skill: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Skill',
      required: true
    },
    proficiency: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
      default: 'Intermediate' 
    }
  }],
  skills_seeking: [{ // New Field
    skill: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Skill',
      required: true
    }
  }],
  average_helpfulness: { // New Field
    type: Number, 
    default: 0 
  },
  average_politeness: { // New Field
    type: Number, 
    default: 0 
  },
  total_ratings: { // New Field
    type: Number, 
    default: 0 
  },
}, { timestamps: { createdAt: 'createdAt' } });

// Pre-save hook to hash password (Unchanged from Commit 6)
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare passwords (Unchanged from Commit 6)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;