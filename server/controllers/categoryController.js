// server/controllers/categoryController.js
import Category from '../models/Category.js'; // ES Module import

export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const newCategory = new Category({ name, type });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    console.log('Backend: getCategories - Attempting to fetch all categories...');
    const categories = await Category.find({});
    console.log('Backend: getCategories - Fetched categories count:', categories.length);
    res.status(200).json(categories);
  } catch (err) {
    console.error('Backend: getCategories - Error:', err);
    res.status(500).json({ error: err.message }); // Explicitly send 500 on server error
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, type }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
