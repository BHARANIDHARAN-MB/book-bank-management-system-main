const mongoose = require('mongoose');

const bookReturnSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookIssue',
    required: true
  },
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
  returnedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  returnDate: {
    type: Date,
    default: Date.now
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged'],
    default: 'good'
  },
  fineCollected: {
    type: Number,
    default: 0
  },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('BookReturn', bookReturnSchema);
