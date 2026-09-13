import { Router } from 'express';
import { getFields } from './field.controller';

const router = Router();

router.get('/', getFields);

export default router;