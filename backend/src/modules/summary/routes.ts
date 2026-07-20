import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import * as controller from './controller.js';

const router = Router();
router.use(auth);

router.get('/', controller.monthlySummary);
router.get('/by-category', controller.byCategory);
router.get('/by-source', controller.bySource);
router.get('/recurring', controller.recurring);

export default router;