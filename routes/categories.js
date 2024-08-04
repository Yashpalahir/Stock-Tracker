const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Render the main page with categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('index', { categories });
  } catch (err) {
    res.render('index', { categories: [], error: 'Error fetching categories' });
  }
});

// Handle form submission to add category
router.post('/add', async (req, res) => {
  const category = new Category({
    name: req.body.name
  });
  
  try {
    await category.save();
    res.redirect('/');
  } catch (err) {
    const categories = await Category.find();
    res.render('index', { categories, error: 'Error adding category' });
  }
});

router.post('/edit', async (req, res) => {
  const { id, name } = req.body;

  try {
    await Category.findByIdAndUpdate(id, { name });
    res.redirect('/');
  } catch (err) {
    const categories = await Category.find();
    res.render('index', { categories, error: 'Error updating category' });
  }
});

// Handle form submission to delete category
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    const categories = await Category.find();
    res.render('index', { categories, error: 'Error deleting category' });
  }
});

module.exports = router;
