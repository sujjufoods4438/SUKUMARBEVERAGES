const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { sendOtpEmail, sendWelcomeEmail } = require('../utils/mailer');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Simple in-memory store for OTPs (in production, use Redis or DB with TTL)
const otpStore = new Map();

// @POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone, name } = req.body;
    if (!email || !phone) return res.status(400).json({ message: 'Email and phone are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Generate random 6 digit OTPs
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, { emailOtp, phoneOtp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // Send email OTP
    await sendOtpEmail(email, name || 'User', emailOtp);
    // Mock SMS send for phone
    console.log(`[MOCK SMS] To: ${phone} | OTP: ${phoneOtp}`);

    res.json({ message: 'OTPs sent successfully to email and phone.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, city, street, pincode, referralCode, emailOtp, phoneOtp } = req.body;

    // Verify OTP
    const storedOtp = otpStore.get(email);
    if (!storedOtp) return res.status(400).json({ message: 'OTPs expired or not generated' });
    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTPs have expired. Please request again.' });
    }
    if (storedOtp.emailOtp !== emailOtp || storedOtp.phoneOtp !== phoneOtp) {
      return res.status(400).json({ message: 'Invalid OTPs provided' });
    }

    if (!['Vijayawada', 'Hyderabad'].includes(city)) {
      return res.status(400).json({ message: 'Service available only in Vijayawada and Hyderabad' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Check referral
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) return res.status(400).json({ message: 'Invalid referral code' });
    }

    const user = await User.create({
      name, email, phone, password,
      address: { street, city, pincode },
      registrationFee: 1500,
      registrationPaid: true,
      registrationDate: new Date(),
      referredBy: referrer ? referrer._id : null,
      discountPercent: referrer ? 25 : 0,
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });

    // Clear OTP after successful registration
    otpStore.delete(email);

    // Give 3 bottles on joining
    const product = await Product.findOne({ isActive: true });
    if (product) {
      await Order.create({
        user: user._id,
        product: product._id,
        quantity: 3,
        pricePerUnit: 50,
        discount: user.discountPercent,
        deliveryAddress: user.address,
        paymentStatus: 'Paid',
        deliveryStatus: 'Delivered',
        billingDate: new Date()
      });
      user.bottlesGiven = 3;
      await user.save();
    }

    // Handle referral record & update referrer discount
    if (referrer) {
      await Referral.create({
        referrer: referrer._id,
        referee: user._id,
        referralCode,
        discountGiven: 25
      });
      referrer.referralCount += 1;
      referrer.discountPercent = Math.min(referrer.discountPercent + 25, 25);
      await referrer.save();
    }

    // Send Welcome Email with Referral Code
    await sendWelcomeEmail(user.email, user.name, user.referralCode);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      discountPercent: user.discountPercent,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error('REGISTER ERROR STACK:', err);
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      discountPercent: user.discountPercent,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

module.exports = router;
