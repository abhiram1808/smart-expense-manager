// server/routes/categoryRoutes.js
import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js'; // ES Module import

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
