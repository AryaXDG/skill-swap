import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { registerRules, loginRules, validate } from '../middleware/validationMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.get('/me', authMiddleware, getMe); // NEW: Protected route

export default router;