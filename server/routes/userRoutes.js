import express from 'express';
import { getUserProfile, updateUserProfile, updateUserSkills } from '../controllers/userController.js';
import { profileSkillsRules, validate } from '../middleware/validationMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/profile/skills', authMiddleware, profileSkillsRules, validate, updateUserSkills);

export default router;