const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to display products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find().populate('categoryId').exec();

    // Organize products by category
    const productByCategory = categories.reduce((acc, category) => {
      if (!category || !category._id) return acc; // Skip invalid categories
      acc[category._id] = products.filter(product => product.categoryId && product.categoryId._id.toString() === category._id.toString());
      return acc;
    }, {});

    res.render('products', { categories, products: productByCategory });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to show add product form
router.get('/add', async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('addProduct', { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to handle add product form submission
router.post('/add', upload.single('image'), async (req, res) => {
  const { name, description, price, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      categoryId
    });

    await newProduct.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to handle product deletion
router.post('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to handle product editing
router.post('/edit', upload.single('image'), async (req, res) => {
  const { id, name, description, price, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updateData = { name, description, price, categoryId };
    if (image) updateData.image = image;

    await Product.findByIdAndUpdate(id, updateData);
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//for pagination
router.get('/', async (req, res) => {
  const itemsPerPage = 12; // Number of items to show per page
  const page = parseInt(req.query.page) || 1; // Current page
  const skip = (page - 1) * itemsPerPage; // Skip calculation for pagination

  try {
    const categories = await Category.find();
    const products = await Product.find().populate('categoryId').skip(skip).limit(itemsPerPage).exec();
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Organize products by category
    const productByCategory = categories.reduce((acc, category) => {
      if (!category || !category._id) return acc; // Skip invalid categories
      acc[category._id] = products.filter(product => product.categoryId && product.categoryId._id.toString() === category._id.toString());
      return acc;
    }, {});

    // Pass all necessary variables to the view
    res.render('products', { 
      categories, 
      products: productByCategory, 
      totalPages, 
      currentPage: page 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
