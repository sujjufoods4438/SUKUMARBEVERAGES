const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, default: 'AW Alkaline Water Bottle' },
  description: { type: String, default: '8.5 pH Alkaline Water – Govt Approved Standard' },
  price:       { type: Number, default: 50 },
  size:        { type: String, default: '1 Litre' },
  phLevel:     { type: Number, default: 8.5 },
  stock:       { type: Number, default: 1000 },
  image:       { type: String },
  isActive:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
