import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    index: true 
  },
  category: { 
    type: String, 
    required: true, 
    trim: true,
    index: true
  }
}, { timestamps: false });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;