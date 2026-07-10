const mongoose = require('mongoose');

const bookOrderSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  requiredDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  purpose: {
    type: String,
    enum: ['study', 'reference', 'assignment', 'project', 'other'],
    default: 'study'
  },
  remarks: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('BookOrder', bookOrderSchema);
