const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: { type: String, required: true },
  discountGiven: { type: Number, default: 25 },   // 25% lifetime discount
  status:     { type: String, enum: ['Pending','Active','Expired'], default: 'Active' },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Referral', referralSchema);
