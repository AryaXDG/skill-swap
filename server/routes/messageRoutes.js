import express from 'express';
import { getMessages } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:interactionId', authMiddleware, getMessages);

export default router;