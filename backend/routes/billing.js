const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { sendInvoiceEmail } = require('../utils/mailer');

// @POST /api/billing/generate (admin – generate 15-day bills)
router.post('/generate', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isActive: true, role: 'customer' });
    const bills = [];

    for (const user of users) {
      const periodEnd = new Date();
      const periodStart = new Date(periodEnd - 15 * 24 * 60 * 60 * 1000);

      const orders = await Order.find({
        user: user._id,
        paymentStatus: 'Pending',
        createdAt: { $gte: periodStart, $lte: periodEnd }
      });

      if (orders.length === 0) continue;

      const subtotal = orders.reduce((sum, o) => sum + o.totalPrice, 0);
      const discount = orders.reduce((sum, o) => sum + ((o.totalPrice * o.discount) / 100), 0);
      const gstAmount = (subtotal - discount) * 0.18;
      const totalAmount = subtotal - discount + gstAmount;

      const bill = await Bill.create({
        user: user._id,
        orders: orders.map(o => o._id),
        periodStart, periodEnd,
        subtotal, discount, gstAmount, totalAmount,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        gstNumber: req.body.gstNumber || ''
      });

      // Send invoice by email
      try {
        await sendInvoiceEmail(user.email, user.name, bill);
        bill.invoiceSent = true;
        bill.invoiceSentAt = new Date();
        await bill.save();
      } catch (mailErr) {
        console.warn('Mail not sent:', mailErr.message);
      }

      // Reset user bookings & next billing date
      user.bookingsLeft = 2;
      user.nextBillingDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      await user.save();

      bills.push(bill);
    }

    res.json({ message: `${bills.length} bills generated`, bills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/billing/my
router.get('/my', protect, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/billing/:id/pay
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, user: req.user._id });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    bill.paymentStatus = 'Paid';
    bill.paymentMethod = req.body.paymentMethod;
    bill.transactionId = req.body.transactionId;
    bill.paidAt = new Date();
    await bill.save();

    // Update all orders in bill as paid
    await Order.updateMany({ _id: { $in: bill.orders } }, { paymentStatus: 'Paid' });

    res.json({ message: 'Payment successful', bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/billing (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bills = await Bill.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
