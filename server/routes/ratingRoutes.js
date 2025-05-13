import express from 'express';
import { addRating } from '../controllers/ratingController.js';
import { ratingRules, validate } from '../middleware/validationMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:interactionId', authMiddleware, ratingRules, validate, addRating);

export default router;