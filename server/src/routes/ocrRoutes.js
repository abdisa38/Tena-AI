import express from 'express';
import { analyzeMedicalDocument } from '../controllers/ocrController.js';

const router = express.Router();

router.post('/analyze', analyzeMedicalDocument);

export default router;
