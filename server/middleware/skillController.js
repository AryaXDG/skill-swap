import Skill from '../models/Skill.js';

// @desc    Get all skills, with optional search
// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (req, res) => {
  const { search } = req.query;
  
  try {
    let query = {};
    if (search) {
      // Case-insensitive regex search
      query.name = { $regex: search, $options: 'i' };
    }
    
    const skills = await Skill.find(query).sort('name');
    res.status(200).json({ status: "success", data: skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};