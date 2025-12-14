import { Router } from 'express';
import { sweetController } from '../controllers/sweet.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { 
  createSweetSchema, 
  updateSweetSchema, 
  searchSweetSchema,
  purchaseSchema,
  restockSchema 
} from '../validations/sweet.validation';

const router = Router();

// Public routes (still require authentication)
router.get('/', authenticate, sweetController.getAll);
router.get('/search', authenticate, validate(searchSweetSchema, 'query'), sweetController.search);
router.get('/:id', authenticate, sweetController.getById);

// User purchase
router.post('/:id/purchase', authenticate, validate(purchaseSchema), sweetController.purchase);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), validate(createSweetSchema), sweetController.create);
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateSweetSchema), sweetController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), sweetController.delete);
router.post('/:id/restock', authenticate, authorize('ADMIN'), validate(restockSchema), sweetController.restock);

export default router;
