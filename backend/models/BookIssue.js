const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
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
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue', 'lost'],
    default: 'issued'
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  finePaid: {
    type: Boolean,
    default: false
  },
  remarks: String,
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookOrder'
  }
}, { timestamps: true });

// Auto-calculate fine on overdue
bookIssueSchema.methods.calculateFine = function() {
  if (this.status === 'issued' && new Date() > this.dueDate) {
    const daysOverdue = Math.floor((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    this.fineAmount = daysOverdue * 2; // ₹2 per day
    this.status = 'overdue';
  }
  return this.fineAmount;
};

module.exports = mongoose.model('BookIssue', bookIssueSchema);
