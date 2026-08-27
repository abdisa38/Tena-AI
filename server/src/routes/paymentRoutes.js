import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-intent', createPaymentIntent);

export default router;
