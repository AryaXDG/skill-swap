import express from 'express';
import { 
  getMatches, 
  requestInteraction, 
  getUserInteractions, 
  respondToInteraction 
} from '../controllers/interactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/matches', authMiddleware, getMatches);
router.post('/request', authMiddleware, requestInteraction);
router.get('/', authMiddleware, getUserInteractions);
router.put('/:interactionId/respond', authMiddleware, respondToInteraction);

export default router;