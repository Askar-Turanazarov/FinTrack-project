import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from './schema.js';
import * as controller from './controller.js';

const router = Router();
router.use(auth);

router.get('/', controller.list);
router.post('/', validate(createCategorySchema), controller.create);
router.patch('/:id', validate(updateCategorySchema), controller.update);
router.delete('/:id', controller.remove);

export default router;
