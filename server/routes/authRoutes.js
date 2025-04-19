import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { registerRules, loginRules, validate } from '../middleware/validationMiddleware.js';
// authMiddleware import is not needed yet since no routes are protected

const router = express.Router();

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);

// Placeholder for later use:
// router.get('/me', authMiddleware, getMe);

export default router;