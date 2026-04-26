const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  phone:         { type: String, required: true },
  password:      { type: String, required: true },
  role:          { type: String, enum: ['customer', 'admin', 'distributor', 'delivery'], default: 'customer' },
  address: {
    street:  { type: String, required: true },
    city:    { type: String, enum: ['Vijayawada', 'Hyderabad'], required: true },
    pincode: { type: String, required: true }
  },
  // Delivery Partner / Vehicle details
  vehicleDetails: {
    type:     { type: String }, // Bike, Auto, Van
    number:   { type: String },
    model:    { type: String }
  },
  liveLocation: {
    lat: { type: Number },
    lng: { type: Number },
    lastUpdated: { type: Date }
  },
  referralCode:   { type: String, unique: true },
  referredBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCount:  { type: Number, default: 0 },
  discountPercent:{ type: Number, default: 0 },   // up to 25% lifetime discount

  // Registration
  registrationFee:  { type: Number, default: 1500 },
  registrationPaid: { type: Boolean, default: false },
  registrationDate: { type: Date },

  // Bottles given on joining
  bottlesGiven:  { type: Number, default: 0 },     // 3 bottles on joining
  bookingsLeft:  { type: Number, default: 2 },      // 2 bookings per person

  // Billing cycle (every 15th day)
  nextBillingDate: { type: Date },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Generate referral code
userSchema.pre('save', function() {
  if (!this.referralCode) {
    this.referralCode = 'AW-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
