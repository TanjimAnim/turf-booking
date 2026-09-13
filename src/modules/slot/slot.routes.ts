import { Router } from 'express';
import { generateSlots } from './slot.controller';

const router = Router();

router.post('/generate', generateSlots);

export default router;