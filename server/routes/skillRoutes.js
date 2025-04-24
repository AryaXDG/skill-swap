import express from 'express';
import { getAllSkills } from '../controllers/skillController.js';

const router = express.Router();

router.get('/', getAllSkills);

export default router;