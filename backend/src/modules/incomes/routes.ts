import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createIncomeSchema, updateIncomeSchema } from './schema.js';
import * as controller from './controller.js';

const router = Router();
router.use(auth);

router.get('/', controller.list);
router.post('/', validate(createIncomeSchema), controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', validate(updateIncomeSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;