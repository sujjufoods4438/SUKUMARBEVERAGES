const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:   { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, default: 50 },
  totalPrice: { type: Number },
  discount:   { type: Number, default: 0 },
  finalPrice: { type: Number },

  deliveryAddress: {
    street:  String,
    city:    String,
    pincode: String
  },
  deliveryTime:   { type: String, default: '12 hours' },
  deliveryStatus: { type: String, enum: ['Pending','Processing','Out for Delivery','Delivered','Cancelled'], default: 'Pending' },
  deliveredAt:    { type: Date },
  
  // Delivery Verification
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryPhoto:   { type: String }, // Image path/URL
  deliveryGPS: {
    lat: { type: Number },
    lng: { type: Number }
  },

  paymentMethod:  { type: String, enum: ['UPI','Card','Net Banking','Cash'], default: 'UPI' },
  paymentStatus:  { type: String, enum: ['Pending','Paid','Failed'], default: 'Pending' },
  transactionId:  { type: String },
  gstNumber:      { type: String },
  gstAmount:      { type: Number, default: 0 },
  invoiceNumber:  { type: String },
  invoiceSentAt:  { type: Date },

  billingCycle:   { type: String, default: '15-day' },
  billingDate:    { type: Date },

  createdAt: { type: Date, default: Date.now }
});

// Auto-calculate prices before save
orderSchema.pre('save', function() {
  this.totalPrice = this.quantity * this.pricePerUnit;
  const discountAmt = (this.totalPrice * this.discount) / 100;
  this.gstAmount = ((this.totalPrice - discountAmt) * 0.18);
  this.finalPrice = this.totalPrice - discountAmt + this.gstAmount;
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'INV-' + Date.now();
  }
});

module.exports = mongoose.model('Order', orderSchema);
