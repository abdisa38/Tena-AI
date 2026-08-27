import express from 'express';
import { assessSymptoms, getTriageHistory } from '../controllers/triageController.js';

const router = express.Router();

router.post('/assess', assessSymptoms);
router.get('/history/:userId', getTriageHistory);

export default router;
