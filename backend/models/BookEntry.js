const mongoose = require('mongoose');

const bookEntrySchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entryType: {
    type: String,
    enum: ['new_arrival', 'restock', 'correction', 'withdrawal'],
    default: 'new_arrival'
  },
  quantityAdded: {
    type: Number,
    default: 0
  },
  quantityRemoved: {
    type: Number,
    default: 0
  },
  reason: String,
  vendorRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invoiceNumber: String,
  entryDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('BookEntry', bookEntrySchema);
