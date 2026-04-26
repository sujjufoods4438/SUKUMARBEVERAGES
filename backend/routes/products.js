const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/products (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed default product
router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    const exists = await Product.findOne({});
    if (exists) return res.json({ message: 'Product already seeded', product: exists });
    const product = await Product.create({
      name: 'AW Alkaline Water Bottle',
      description: '8.5 pH Premium Alkaline Water – Government Approved Standard',
      price: 50,
      size: '1 Litre',
      phLevel: 8.5,
      stock: 10000
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
