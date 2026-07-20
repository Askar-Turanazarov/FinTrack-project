import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createIncomeSourceSchema, updateIncomeSourceSchema } from './schema.js';
import * as controller from './controller.js';

const router = Router();

router.use(auth);

router.get('/', controller.list);
router.post('/', validate(createIncomeSourceSchema), controller.create);
router.patch('/:id', validate(updateIncomeSourceSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;