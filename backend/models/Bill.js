const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orders:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  billNumber:  { type: String, unique: true },
  periodStart: { type: Date },
  periodEnd:   { type: Date },

  subtotal:    { type: Number, default: 0 },
  discount:    { type: Number, default: 0 },
  gstAmount:   { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },

  paymentStatus: { type: String, enum: ['Due','Paid','Overdue'], default: 'Due' },
  paymentMethod: { type: String, enum: ['UPI','Card','Net Banking','Cash'] },
  transactionId: { type: String },
  paidAt:        { type: Date },
  dueDate:       { type: Date },

  // E-mail invoice
  invoiceSent:   { type: Boolean, default: false },
  invoiceSentAt: { type: Date },
  gstNumber:     { type: String },

  createdAt: { type: Date, default: Date.now }
});

billSchema.pre('save', function(next) {
  if (!this.billNumber) {
    this.billNumber = 'BILL-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);
