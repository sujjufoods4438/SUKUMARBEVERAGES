const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/orders – place an order
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity, paymentMethod, transactionId, gstNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (user.bookingsLeft <= 0) {
      return res.status(400).json({ message: 'No bookings remaining for this period' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const order = await Order.create({
      user: user._id,
      product: productId,
      quantity,
      pricePerUnit: product.price,
      discount: user.discountPercent,
      deliveryAddress: user.address,
      deliveryTime: '12 hours',
      paymentMethod,
      transactionId,
      gstNumber,
      paymentStatus: transactionId ? 'Paid' : 'Pending',
      billingDate: user.nextBillingDate
    });

    // Deduct stock & booking
    product.stock -= quantity;
    await product.save();
    user.bookingsLeft -= 1;
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/orders/my – user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('product', 'name price phLevel')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/orders – all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .populate('product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/orders/:id/assign (admin)
router.put('/:id/assign', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPartner: req.body.deliveryPartnerId, deliveryStatus: 'Processing' },
      { new: true }
    ).populate('deliveryPartner', 'name phone');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/orders/:id/complete (delivery partner)
router.put('/:id/complete', protect, async (req, res) => {
  try {
    if (req.user.role !== 'delivery' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only delivery partners can complete orders' });
    }
    const { deliveryPhoto, deliveryGPS } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        deliveryStatus: 'Delivered', 
        deliveredAt: new Date(),
        deliveryPhoto,
        deliveryGPS
      },
      { new: true }
    );
    // Notification for Admin
    console.log(`[NOTIFICATION] Admin: Order ${order._id} completed by ${req.user.name}`);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
