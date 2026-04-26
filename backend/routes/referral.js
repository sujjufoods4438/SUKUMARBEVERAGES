const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/referral/my – get my referral info
router.get('/my', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const referrals = await Referral.find({ referrer: req.user._id }).populate('referee', 'name email createdAt');
    res.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      discountPercent: user.discountPercent,
      referrals
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/referral/validate/:code
router.get('/validate/:code', async (req, res) => {
  try {
    const user = await User.findOne({ referralCode: req.params.code }).select('name referralCode');
    if (!user) return res.status(404).json({ message: 'Invalid referral code' });
    res.json({ valid: true, referrerName: user.name, discount: 25 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
