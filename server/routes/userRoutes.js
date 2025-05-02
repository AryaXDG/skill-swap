import express from 'express';
import { getUserProfile, updateUserProfile, updateUserSkills } from '../controllers/userController.js';
import { profileSkillsRules, validate } from '../middleware/validationMiddleware.js'; // NEW Imports
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get a user's profile
router.get('/:userId', getUserProfile);

// Private route to update the current user's profile
router.put('/profile', authMiddleware, updateUserProfile);

// Private route to update the current user's skills (NEW)
router.put('/profile/skills', authMiddleware, profileSkillsRules, validate, updateUserSkills); 

export default router;