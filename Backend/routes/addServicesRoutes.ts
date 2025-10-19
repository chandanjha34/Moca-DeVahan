import express from 'express';
const router = express.Router();
import { addServices, displayServiceHash } from '../controllers/VehicleServices';


router.post('/',addServices)
router.post('/display',displayServiceHash)

export default router;