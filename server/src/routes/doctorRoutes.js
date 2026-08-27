import express from 'express';
import { getDoctors, getDoctorById, getFacilities } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/facilities', getFacilities);
router.get('/:id', getDoctorById);

export default router;
