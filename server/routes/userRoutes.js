import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
// validationMiddleware and updateUserSkills are added in later commits

const router = express.Router();

// Public route to get a user's profile
router.get('/:userId', getUserProfile);

// Private route to update the current user's profile
router.put('/profile', authMiddleware, updateUserProfile);

// Placeholder for later use:
// router.put('/profile/skills', authMiddleware, profileSkillsRules, validate, updateUserSkills);

export default router;