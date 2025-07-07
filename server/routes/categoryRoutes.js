// routes/categoryRoutes.js
import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

// POST a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const newCat = new Category({ name });
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
