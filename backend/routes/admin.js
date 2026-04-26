const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Bill = require('../models/Bill');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers   = await User.countDocuments({ role: 'customer' });
    const totalOrders  = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$finalPrice' } } }
    ]);
    const pendingBills = await Bill.countDocuments({ paymentStatus: 'Due' });
    const vijayawada   = await User.countDocuments({ 'address.city': 'Vijayawada' });
    const hyderabad    = await User.countDocuments({ 'address.city': 'Hyderabad' });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingBills,
      cityWise: { vijayawada, hyderabad }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
